'use strict'

/* eslint-env mocha */

const Utils = require('./utils')
const promisify = require('promisify-es6')
const {parallel, waterfall} = require('async')

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)

const num = 24

module.exports = (common) => {
  describe('interface-discovery', () => {
    let peerA
    let peerB
    let peerM // peer in the middle
    let peerE // non-existent peer (peer-info only)

    let exchangeA
    let exchangeB
    let exchangeM

    before(async () => {
      peerA = await Utils.createPeer('a', common.opt.peerA)
      peerB = await Utils.createPeer('b', common.opt.peerB)
      peerM = await Utils.createPeer('m', common.opt.peerM)
      peerE = await Utils.createPeerInfo('e')

      exchangeA = new common.Exchange(peerA, common.opt.exchangeA)
      exchangeB = new common.Exchange(peerB, common.opt.exchangeB)
      exchangeM = new common.Exchange(peerM, common.opt.exchangeM)

      await new Promise((resolve, reject) => { // TODO: hope we can get rid of this soon
        waterfall([
          cb => parallel([peerA, peerB, peerM].map(p => cb => p.start(cb)), e => cb(e))
        ], e => e ? reject(e) : resolve())
      })

      await Promise.all([exchangeA, exchangeB, exchangeM].map(e => e.start()))

      await common.before(exchangeA, exchangeB, exchangeM) // things like connecting to peerB get done here
    })

    it('create handler for "test" on peer a', () => {
      exchangeA.handle('test', async (id, data) => {
        data = parseInt(String(data), 10)
        return Buffer.from(String(data * 10))
      })
    })

    it('request "test" b->a should succeed', async () => {
      const result = await exchangeB.request(peerA.peerInfo.id, 'test', Buffer.from(String(num)))
      expect(String(result)).to.equal(String(num * 10))
    })

    it('remove handler for "test" on peer a', () => {
      exchangeA.unhandle('test')
    })

    it('request "test" b->a should fail', async () => {
      try {
        const result = exchangeB.request(peerA.peerInfo.id, 'test', Buffer.from(String(num)))
        expect(result).to.not.exist()
      } catch (err) {
        expect(err).to.exist()
      }
    })

    it('request to non-existent peer should fail', async () => {
      try {
        const result = exchangeB.request(peerE.id, 'test', Buffer.from(String(num)))
        expect(result).to.not.exist()
      } catch (err) {
        expect(err).to.exist()
      }
    })

    after(async () => {
      await Promise.all([exchangeA, exchangeB, exchangeM].map(e => e.stop()))

      await new Promise((resolve, reject) => {
        waterfall([
          cb => parallel([peerA, peerB, peerM].map(p => cb => p.stop(cb)), e => cb(e))
        ], e => e ? reject(e) : resolve())
      })
    })
  })
}
