'use strict'

const tests = require('../src/test')

tests({
  opt: {},
  before: async (eA, eB, eM) => {
    let link = {}
    let e = [eA, eB, eM]
    e.forEach(e => {
      link[e.swarm.peerInfo.id.toB58String()] = e
      e.link = link
    })
  },
  Exchange: require('./fake-exchange')
})
