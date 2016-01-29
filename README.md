# CappedCache

An abstraction of the [NodeCache](https://github.com/tcs-de/nodecache) memory cache that supports a max size option.

[![Build status](https://circleci.com/gh/NET-A-PORTER/capped-cache.svg?style=shield)](https://circleci.com/gh/NET-A-PORTER/capped-cache)

## Node.js Versions

Supports 0.12.x and above.


## Installation

`npm i --save capped-cache`


## API

The API essentially matches that of NodeCache, but with a couple of additional behaviours.


### `function CappedCache([options])`

A constructor function that creates a new instance of CappedCache, with an associated NodeCache instance under the hood. `options` is an optional object that permits the configuration of the cache:
* `maxSize` - the maximum number of objects that CappedCache can store at any given time
* `defaultTTL` - the default TTL, in seconds, for objects stored in the cache

So that performance isn't compromised, the instance of NodeCache created under the hood will have its `useClones` option set to `false`.


### `CappedCache.prototype.get(cacheKey)`

Gets the object associated with the specified cache key. `cacheKey` must be a `String`. If the key is not found, then this method will return `undefined`.


### `CappedCache.prototype.set(cacheKey, data, [ttl])`

Stores an object in the cache with the associated key. An optional TTL can be passed if one wishes to override the default.

This method returns a `Boolean` that reflects whether the item was successfully stored:
* If the number of stored items exceeds the configured `maxSize`, then this will return `false`, and the item will **not** be stored
* In all other cases, the item will be stored, and this method will return `true`.


### `CappedCache.prototype.flushAll()`

Flushes all data from the cache.


## Local development

### Setup

1. Fork this repo
2. Clone said fork
3. `npm i`


### Unit tests

Unit tests are written with Mocha, Chai, and Sinon. Run with `npm test`.


## Contributing

Definitely more than happy to accept pull requests. Just be sure to use tabs instead of spaces, as this is the existing formatting convention.