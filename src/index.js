'use strict'

const debug = require('debug')

class ExchangeBase {
  constructor (swarm, id) {
    this.log = debug(id)
    this.swarm = swarm
    this.handlers = {}
  }

  handle (ns, handler) {
    this.handlers[ns] = handler
    this.log('handling %s', ns)
  }

  unhandle (ns) {
    this.log('unhandling %s', ns)
    delete this.handlers[ns]
  }

  async _handle (ns, from, data) {
    const handler = this.handlers[ns]

    if (!handler) { // if we don't have a handler send NACK
      this.log('NACK %s from %s, reason: no handler', ns, from)
      return { nack: true }
    }

    try {
      const result = await handler(from, data)
      return { result }
    } catch (err) {
      this.log('NACK %s from %s, reason: error %s', ns, from, err)
      return { nack: true }
    }
  }
}

module.exports = ExchangeBase
