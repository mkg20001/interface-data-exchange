'use strict'

const tests = require('../src/test')

tests({
  opt: {},
  before: (eA, eB, eM, cb) => {
    let link = {}
    Array(eA, eB, eM).forEach(e => {
      link[e.swarm.peerInfo.id.toB58String()] = e
      e.link = link
    })
    cb()
  },
  Exchange: require('./fake-exchange')
})
