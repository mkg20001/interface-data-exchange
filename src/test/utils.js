'use strict'

const ids = require('./ids.json')
const promisify = require('promisify-es6')
const Id = require('peer-id')
const Peer = require('peer-info')

const Libp2p = require('libp2p')
const WS = require('libp2p-websockets')
const MPLEX = require('libp2p-mplex')
const SECIO = require('libp2p-secio')

const createPeerInfo = async (id) => {
  return new Peer(await promisify(Id.createFromJSON.bind(Id, ids[id]))())
}

const createPeer = async (id, opt) => {
  let peer = await createPeerInfo(id)
  if (!opt) opt = {}
  if (!opt.addrs) opt.addrs = []
  opt.addrs.forEach(a => peer.multiaddrs.add(a))

  const modules = {
    transport: [
      new WS()
    ],
    connection: {
      muxer: [
        MPLEX
      ],
      crypto: [
        SECIO
      ]
    }
  }

  return new Libp2p(modules, peer, null, opt.lp2pOpt)
}

module.exports = {
  createPeerInfo,
  createPeer
}
