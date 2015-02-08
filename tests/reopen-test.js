'use strict';

var CoreObject = require('../core-object');
var assert     = require('assert');

describe('reopen', function() {
  it('can add new properties', function() {
    var called = false;

    var Klass = CoreObject.extend({
      init: function() {}
    });

    Klass.reopen({
      baz: function() {
        called = true;
      }
    });

    var klass = new Klass();
    klass.baz();

    assert.ok(called);
  });

  it('can call super', function() {
    var a = false,
        b = false,
        c = false;

    var Klass = CoreObject.extend({
      init: function() {},
      baz: function() {
        a = true;
      }
    });

    var Klass2 = Klass.extend({
      baz: function() {
        this._super();
        b = true;
      }
    });

    var Klass3 = Klass2.extend({
      baz: function() {
        this._super();
      }
    });

    Klass3.reopen({
      baz: function() {
        this._super();
        c = true;
      }
    });


    var klass = new Klass3();
    klass.baz();

    assert.ok(a);
    assert.ok(b);
    assert.ok(c);
  });

  it('reopens respect the inheritance hierarchy', function() {
    var Klass = CoreObject.extend();
    var Klass1 = Klass.extend();
    var Klass2=  Klass1.extend();

    Klass2.reopen({
      foo: function() {
        return this._super() + '.klass2';
      }
    });

    Klass1.reopen({
      foo: function() {
        return this._super() + '.klass1';
      }
    });

    Klass.reopen({
      foo: function() {
        return 'klass0';
      }
    });

    assert.equal(new Klass2().foo(), 'klass0.klass1.klass2');
  });

  it('should throw if an instance is reopened', function() {
    var Klass = CoreObject.extend({});
    var klass = new Klass();
    assert.throws(Klass.reopen, 'You attempted to reopen a class that has already been extended.');
  });
});
