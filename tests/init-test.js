'use strict';

var CoreObject = require('../core-object');
var assert     = require('assert');

describe('init', function() {
  it('is called with the arguments to new', function() {
    var called = false;

    var Klass = CoreObject.extend({
      init: function(foo) {
        called = foo;
      }
    });

    var instance = new Klass('foo');

    assert.equal(called, 'foo');
  });

  it('is called once when we instantiate a grandchild class', function() {
    var called = 0;

    var Klass1 = CoreObject.extend({ });

    var Klass2 = Klass1.extend({
      init: function() {
        called += 1;
      }
    });

    var instance = new Klass2();

    assert.equal(called, 1);
  });

  it('is called if the subclass takes no arguments and fails to call _super', function() {
    var Klass = CoreObject.extend({
      init: function() { }
    });

    var instance = new Klass({ foo: 'bar' });

    assert.equal(instance.foo, 'bar');
  });

  it('is called if the subclass takes no arguments and fails to call _super (whacky whitespace version)', function() {
    var Klass = CoreObject.extend({
      init: function( ) { }
    });

    var instance = new Klass({ foo: 'bar' });

    assert.equal(instance.foo, 'bar');
  });

  it('is not called if the subclass takes arguments', function() {
    var Klass = CoreObject.extend({
      init: function(data) {
        this.data = data;
      }
    });

    var stooge = { foo: 'bar' };
    var instance = new Klass(stooge);

    assert.equal(instance.data, stooge);
    assert.equal(instance.foo, undefined);
  });
});
