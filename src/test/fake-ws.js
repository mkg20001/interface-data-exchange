'use strict'

const mafmt = require('mafmt')
const withIs = require('class-is')
const Connection = require('interface-connection').Connection
const includes = require('lodash.includes')
const EE = require('events').EventEmitter
const duplex = require('pull-pair/duplex')
const noop = () => {}

const debug = require('debug')
const log = debug('libp2p:websockets:fake')

const EX = global.FAKE_WS_EX = global.FAKE_WS_EX || {}

class WebSockets {
  dial (ma, options, callback) {
    if (typeof options === 'function') {
      callback = options
      options = {}
    }

    callback = callback || function () {}

    log('dialing %s', ma)

    let pair = duplex()

    const conn = new Connection(pair[0])
    conn.getObservedAddrs = (cb) => cb(null, [ma])

    const conn2 = new Connection(pair[1])
    conn2.getObservedAddrs = (cb) => cb(null, [])

    EX[ma.decapsulate('ipfs').toString()].emit('connection', conn2)

    setImmediate(() => callback(null, conn))

    return conn
  }

  createListener (options, handler) {
    if (typeof options === 'function') {
      handler = options
      options = {}
    }

    const listener = new EE()

    let listeningMultiaddr

    listener._listen = listener.listen
    listener.listen = (ma, callback) => {
      callback = callback || noop
      listeningMultiaddr = ma

      if (includes(ma.protoNames(), 'ipfs')) {
        ma = ma.decapsulate('ipfs')
      }

      log('listening on %s', ma)

      EX[ma.toString()] = listener

      callback()
    }

    listener.on('connection', handler)

    listener.getAddrs = (callback) => {
      callback(null, listeningMultiaddr ? [listeningMultiaddr] : [])
    }

    listener.close = cb => cb ? cb() : 0

    return listener
  }

  filter (multiaddrs) {
    if (!Array.isArray(multiaddrs)) {
      multiaddrs = [multiaddrs]
    }

    return multiaddrs.filter((ma) => {
      if (includes(ma.protoNames(), 'p2p-circuit')) {
        return false
      }

      if (includes(ma.protoNames(), 'ipfs')) {
        ma = ma.decapsulate('ipfs')
      }

      return mafmt.WebSockets.matches(ma) ||
        mafmt.WebSocketsSecure.matches(ma)
    })
  }
}

module.exports = withIs(WebSockets, { className: 'WebSockets', symbolName: '@libp2p/js-libp2p-websockets/websockets' })
