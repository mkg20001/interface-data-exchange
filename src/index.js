'use strict'

class ExchangeBase {
  constructor (swarm) {
    this.swarm = swarm
    this.handlers = {}
  }

  handle (ns, handler) {
    this.handlers[ns] = handler
  }

  unhandle (ns) {
    delete this.handlers[ns]
  }

  _handle(ns, from, data, cb) {
    const handler = this.handlers[ns]

    if (!handler) { // if we don't have a handler send NACK
      return cb(null, {nack: true})
    }

    handler(from, data, (err, result) => {
      if (err) {
        return cb(null, {nack: true})
      }

      return cb(null, {result})
    })
  }
}

module.exports = ExchangeBase
