'use strict'

const ids = require('./ids.json')
const Id = require('peer-id')
const Peer = require('peer-info')

const Libp2p = require('libp2p')
const WS = require('libp2p-websockets')
const MPLEX = require('libp2p-mplex')
const SECIO = require('libp2p-secio')

const createPeerInfo = async (id) => {
  return new Peer(await Id.createFromJSON(ids[id]))
}

const createPeer = async (id, opt) => {
  const peer = await createPeerInfo(id)
  if (!opt) opt = {}
  if (!opt.addrs) opt.addrs = []
  opt.addrs.forEach(a => peer.multiaddrs.add(a))

  const params = {
    // The libp2p modules for this libp2p bundle
    modules: {
      transport: [
        new WS() // It can take instances too!
      ],
      streamMuxer: [
        MPLEX
      ],
      connEncryption: [
        SECIO
      ]
    },

    // libp2p config options (typically found on a config.json)
    config: opt.lp2pOpt,

    peerInfo: peer
  }

  return new Libp2p(params)
}

module.exports = {
  createPeerInfo,
  createPeer
}
