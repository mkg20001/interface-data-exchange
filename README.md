interface-data-exchange
===================

[![](https://img.shields.io/badge/made%20by-mkg20001-blue.svg?style=flat-square)](https://github.com/mkg20001)

> A test suite and interface you can use to implement a libp2p data-exchange. A libp2p data-exchange is understood as something that offers an encrypted way to exchange a single request/response in order to establish a connection over a signalling-based transport such as WebRTC.

# Why?

### I've made [ » some slides](https://docs.google.com/presentation/d/1yfxI_4wY-5ydFxcIr2NBsg8E0wyJJStekRfectZjcf0/edit?usp=sharing) to explain what it does and why it does it

# Modules that implement the interface

- [js-libp2p-exchange-direct](https://github.com/mkg20001/libp2p-exchange-direct) _WIP_
- [js-libp2p-exchange-rendezvous](https://github.com/mkg20001/libp2p-exchange-rendezvous) _WIP_

# How to use the battery of tests

## Node.js

Create a new testfile `test/exchange.spec.js` and bootstrap it off this template. Then tweak it for your needs.

```js
'use strict'

const tests = require('interface-data-exchange/src/test')

tests({
  opt: {
    peerA: {
      addrs: [], // addresses for peer (can be left empty if peer should only listen on circuit)
      lp2pOpt: { // additional libp2p options (such as enabling relay)
        relay: {
          enabled: true
        }
      }
    },
    peerB: {},
    peerM: {
      addrs: ['/ip4/127.0.0.1/tcp/5394/ws'], // this ws-server address will get faked in the browser
      lp2pOpt: {
        relay: { // enable relay & active hop. usefull for testing exchanges over circuit
          enabled: true,
          hop: {
            enabled: true,
            active: true
          }
        }
      }
    }
  },
  before: async (eA, eB, eM) => {
    /* run actions such as connecting peers with each other */
  },
  Exchange: require('../src') // include the exchange itself here
})
```

## Go

> WIP

# API

A valid (read: that follows the interface defined) exchange, must implement the following API.

**Table of contents:**

- type: `Exchange`
  - `new Exchange(swarm, [options])`
  - `async exchange.request(id, ns, requestData, [options])`
  - `exchange.handle(ns, asyncHandlerFunction)`
  - `exchange.unhandle(ns, asyncHandlerFunction)`
  - `async exchange.start()`
  - `async exchange.stop()`

