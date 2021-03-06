'use strict';

var CappedCache = require('../index');

var MAX_SIZE = 1;
var DEFAULT_TTL = 5;

describe('CappedCache', function () {
	var mockNodeCache;
	var cappedCache;
	
	beforeEach(function () {
		cappedCache = new CappedCache({
			maxSize: MAX_SIZE,
			defaultTTL: DEFAULT_TTL
		});
		
		mockNodeCache = sinon.mock(cappedCache._cache);
	});
	
	afterEach(function () {
		mockNodeCache.restore();
		
		if (cappedCache._isFull.restore) cappedCache._isFull.restore();
		if (cappedCache._cache.getStats.restore) cappedCache._cache.getStats.restore();
	});
	
	describe('the get method', function () {
		it('should return an item from the underlying cache', function () {
			var key = 'myData';
			var expectedData = 'foobar';
			var actualData;
			
			mockNodeCache.expects('get')
						 .once()
						 .withArgs(key)
						 .returns(expectedData);
					 					 
			actualData = cappedCache.get(key);
			mockNodeCache.verify();
		});
    });
	
	describe('the set method', function () {
		it('should set an item when the cache has space', function () {
			var key = 'myData';
			var data = 'foobar';
			var ttl = 7;
			var expectedResult = true;
			var actualResult;
			
			sinon.stub(cappedCache, '_isFull')
				 .returns(false);
			
			mockNodeCache.expects('set')
						 .once()
						 .withArgs(key, data, ttl);
						 
			actualResult = cappedCache.set(key, data, ttl);
			
			mockNodeCache.verify();
			expect(actualResult).to.equal(expectedResult);
		});
		
		it('should not set an item when the cache has no space', function () {
			var key = 'myData';
			var data = 'foobar';
			var ttl = 7;
			var expectedResult = false;
			var actualResult;
			
			sinon.stub(cappedCache, '_isFull')
				 .returns(true);
			
			mockNodeCache.expects('set')
						 .never();
						 
			actualResult = cappedCache.set(key, data, ttl);
			
			mockNodeCache.verify();
			expect(actualResult).to.equal(expectedResult);
		});
	});
	
	describe('the _isFull method', function () {
		it('should return false if the maxSize option is not set', function () {
			var infiniteCache = new CappedCache();
			var expectedResult = false;
			var actualResult = infiniteCache._isFull();
			
			expect(actualResult).to.equal(expectedResult);
		});
		
		it('should return false if the number of keys does not exceed the max size', function () {
			var expectedResult = false;
			var actualResult;	
			
			sinon.stub(cappedCache._cache, 'getStats')
				 .returns({ keys: 0 });
				 
			actualResult = cappedCache._isFull();
			
			expect(actualResult).to.equal(expectedResult);		 
		});
		
		it('should return true if the number of keys exceeds the max size', function () {
			var expectedResult = true;
			var actualResult;	
			
			sinon.stub(cappedCache._cache, 'getStats')
				 .returns({ keys: MAX_SIZE });
				 
			actualResult = cappedCache._isFull();
			
			expect(actualResult).to.equal(expectedResult);		 
		});
	});
	
	describe('the flushAll method', function () {
		it('should flush the cache', function () {
			mockNodeCache.expects('flushAll')
						 .once();
						 
			cappedCache.flushAll();
			
			mockNodeCache.verify();
		});
	});
});