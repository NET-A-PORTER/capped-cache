'use strict';

var NodeCache = require('node-cache');

function CappedCache(userOptions) {
	var options = userOptions || {};
	
	this._maxSize = options.maxSize;
	this._cache = new NodeCache({ stdTTL: options.defaultTTL, useClones: false });
}

CappedCache.prototype.get = function get(cacheKey) {
	return this._cache.get(cacheKey);
};

CappedCache.prototype.set = function set(cacheKey, data, ttl) {
	var shouldCache = !this._isFull();

	if (shouldCache) {
		this._cache.set(cacheKey, data, ttl);
	}

	return shouldCache;
};

CappedCache.prototype._isFull = function isFull() {
	if (!this._maxSize) {
		return false;
	}

	return this._cache.getStats().keys > this._maxSize;
}

CappedCache.prototype.reset = function reset() {
	this._cache.flushAll();
};

module.exports = CappedCache;