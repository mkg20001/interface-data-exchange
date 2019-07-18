'use strict'

const tests = require('../src/test')

tests({
  opt: {},
  before: (eA, eB, eM) => {
    const link = {}
    const e = [eA, eB, eM]
    e.forEach(e => {
      link[e.swarm.peerInfo.id.toB58String()] = e
      e.link = link
    })
  },
  Exchange: require('./fake-exchange')
})
