interface-data-exchange
===================

[![](https://img.shields.io/badge/made%20by-mkg20001-blue.svg?style=flat-square)](https://github.com/mkg20001)

> A test suite and interface you can use to implement a libp2p data-exchange. A libp2p data-exchange is understood as something that offers an encrypted way to exchange a single request/response in order to establish a connection over a transport such as WebRTC.

# Why?

### I've made [ » some slides](https://docs.google.com/presentation/d/1yfxI_4wY-5ydFxcIr2NBsg8E0wyJJStekRfectZjcf0/edit?usp=sharing) to explain what it does and why it does it

# Modules that implement the interface

- [js-libp2p-exchange-direct](https://github.com/mkg20001/libp2p-exchange-direct) _WIP_
- [js-libp2p-exchange-rendezvous](https://github.com/mkg20001/libp2p-exchange-rendezvous) _WIP_

# How to use the battery of tests

> WIP

# API

A valid (read: that follows the interface defined) exchange, must implement the following API.

**Table of contents:**

- type: `Exchange`
  - `new Exchange(swarm, [options])`
  - `exchange.request(id, ns, requestData, [options], callback)`
  - `exchange.handle(ns, handlerFunction)`
  - `exchange.unhandle(ns, handlerFunction)`
  - `exchange.start(callback)`
  - `exchange.stop(callback)`

