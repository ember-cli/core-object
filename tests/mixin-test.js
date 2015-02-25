/*jshint node:true */
'use strict';


var Mixin  = require('../mixin').Mixin;
var mixin  = require('../mixin').mixin;
var assert = require('assert');

describe('mixin', function() {

  it('should handle noop', function() {
    var mixin1 = new Mixin();
    assert.equal(mixin1.methods, undefined);
    assert.equal(mixin1.properties, undefined);
  });

  it('supports properties that do not conflict', function() {
    var mixin1 = new Mixin({ a: 1, b: 2, c: []});
    assert.deepEqual(mixin1.properties, { a: 1, b: 2, c: []});
  });

  describe('creation', function() {
    it('should place pojos on properties', function() {

      var mixin = new Mixin({
        foo: true
      });

      assert.ok(mixin.properties.foo);
    });

    it('should place mixins on mixins', function() {

      var aMixin = new Mixin({
        baz: true
      });

      var mixin = new Mixin(aMixin);

      assert.equal(mixin.mixins.length, 1);
    });

    it('should take multiple mixins', function() {

      var aMixin = new Mixin({
        baz: true
      });

      var bMixin = new Mixin({
        bar: true
      });

      var mixin = new Mixin(aMixin, bMixin);

      assert.equal(mixin.mixins.length, 2);
    });

    it('should convert a pojo into a mixin when passed with other mixins', function() {

      var aMixin = new Mixin({
        baz: true
      });

      var bMixin = new Mixin({
        bar: true
      });

      var mixin = new Mixin(aMixin, bMixin, {
        biz: true
      });

      assert.equal(mixin.mixins.length, 3);
    });
  });

  describe('mixin', function() {
    it('should mixin properties', function() {
      var aMixin = new Mixin({foo: true, bar: 'fhqwhgads'});
      var pojo = {};
      mixin(pojo, aMixin);
      assert.ok(pojo.foo);
      assert.equal(pojo.bar, 'fhqwhgads');
    }); 

    it('should mixin other mixin instances', function() {
      var aMixin = new Mixin({foo: true, bar: 'fhqwhgads'});
      var bMixin = new Mixin(aMixin, {
        fizz: true
      });

      var pojo = {};

      mixin(pojo, bMixin);
      assert.ok(pojo.foo);
      assert.ok(pojo.fizz);
      assert.equal(pojo.bar, 'fhqwhgads');
    });
  });

  describe('super wrapping', function() {
    it('overriding public methods', function() {
      var obj;

      var aMixin = new Mixin({
        method: function() {
          return 'a';
        }
      });

      var bMixin = new Mixin(aMixin, {
        method: function() {
          return this._super() + 'b';
        }
      });

      var cMixin = new Mixin(aMixin, {
        method: function() {
          return this._super() + 'c';
        }
      });

      var dMixin = new Mixin({
        method: function() {
          return this._super() + 'd';
        }
      });

      var fMixin = new Mixin({
        method: function() {
          return this._super() + 'f';
        }
      });


      obj = {};
      mixin(obj, bMixin);
      assert.equal(obj.method(), 'ab');

      obj = {};
      mixin(obj, cMixin);
      assert.equal(obj.method(), 'ac');

      obj = {};
      mixin(obj, aMixin);
      mixin(obj, dMixin);
      assert.equal(obj.method(), 'ad');

      obj = {
        method: function() {
          return 'obj';
        }
      };

      mixin(obj, fMixin);
      assert.equal(obj.method(), 'objf');
    });

    it('should support super with no root', function() {
      var aMixin = new Mixin({
        method: function() {
          this._super();
          return 'a';
        }
      });

      var obj = {};
      mixin(obj, aMixin);

      assert.equal(obj.method(), 'a');

    });
  });
});
