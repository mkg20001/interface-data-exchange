interface-data-exchange
===================

[![](https://img.shields.io/badge/made%20by-mkg20001-blue.svg?style=flat-square)](https://github.com/mkg20001)

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

