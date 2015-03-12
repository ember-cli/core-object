'use strict';

var CoreObject = require('../core-object');
var assert     = require('assert');

describe('core-object.js', function() {
  it('errors if new is not used', function() {
    assert.throws(function() {
      CoreObject();
    }, /Failed to construct: Please use the 'new' operator, this object constructor cannot be called as a function./);

  });

  it('can be extended with functions to add to the new class', function() {
    var called = false;

    var Klass = CoreObject.extend({
      foo: function() {
        called = true;
      }
    });

    var instance = new Klass();
    instance.foo();

    assert(called);
  });

  it('can be provided a base object to `new`', function() {
    var called = false;

    var Klass = CoreObject.extend({
      foo: function() {
        called = 'klass.foo';
      }
    });

    var instance = new Klass({
      foo: function() {
        called = 'instance.foo';
      }
    });

    instance.foo();

    assert.equal(called, 'instance.foo');
  });

  it('an extended class can be extended with functions to add to the new class', function() {
    var fooCalled = false;
    var barCalled = false;

    var Klass1 = CoreObject.extend({
      foo: function() {
        fooCalled = true;
      }
    });

    var Klass2 = Klass1.extend({
      bar: function() {
        barCalled = true;
      }
    });

    var instance = new Klass2();
    instance.foo();
    assert(fooCalled);

    instance.bar();
    assert(barCalled);
  });

  describe('init', function(){

    it('init is called with the arguments to new', function() {
      var called = false;

      var Klass = CoreObject.extend({
        init: function(foo) {
          called = foo;
        }
      });

      var instance = new Klass('foo');

      assert.equal(called, 'foo');
    });

    it('init is called once when we instantiate a grandchild class', function() {
      var called = 0;

      var Klass1 = CoreObject.extend({});

      var Klass2 = Klass1.extend({
        init: function(){
          called += 1;
        }
      });

      var instance = new Klass2();

      assert.equal(called, 1);
    });
  });
});
