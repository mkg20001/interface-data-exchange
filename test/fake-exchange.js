'use strict'

const ExchangeBase = require('../src')

class FakeExchange extends ExchangeBase {
  request (peerId, ns, data, cb) {
    (this.link[peerId.toB58String()] || {_handle: (a, b, c, cb) => cb(null, {nack: true})})._handle(ns, peerId, data, (err, res) => {
      if (res && res.nack) {
        err = new Error('Other side refused to process request')
      }

      if (err) {
        return cb(err)
      }

      return cb(null, res.result)
    })
  }

  start (cb) {
    cb()
  }

  stop (cb) {
    cb()
  }
}

module.exports = FakeExchange
