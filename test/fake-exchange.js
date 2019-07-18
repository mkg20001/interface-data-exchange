'use strict'

const ExchangeBase = require('../src')

class FakeExchange extends ExchangeBase {
  constructor (swarm) {
    return super(swarm, 'fake-exchange')
  }

  async request (peerId, ns, data) {
    const res = await ((this.link[peerId.toB58String()] || {_handle: (a, b, c) => { return { nack: true } }})._handle(ns, peerId, data))

    if (res) {
      if (res.nack) {
        throw new Error('Other side refused to process request')
      }

      return res.result
    }

    throw new Error('Method returned undefined/falsy value')
  }

  async start () { }

  async stop () { }
}

module.exports = FakeExchange
