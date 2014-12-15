'use strict';

var CoreObject = require('../core-object');
var assert     = require('assert');

describe('core-object.js', function() {

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

    it('super chain of inits is called', function() {
      var called = '';

      var Klass1 = CoreObject.extend({
        init: function(){
          called += '1';
        }
      });

      var Klass2 = Klass1.extend({
        init: function(){
          called += '2';
        }
      });

      var Klass3 = Klass2.extend({
        init: function(){
          called += '3';
        }
      });

      var instance = new Klass3();

      assert.equal(called, '123');
    });

  });

  describe('_super', function() {
    it('an extended class can call methods on its parents constructor via _super.methodName', function() {
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
          this._super.foo();
        }
      });

      var instance = new Klass2();

      instance.bar();
      assert(fooCalled, 'foo called');
      assert(barCalled, 'bar called');
    });

    it('an extended class can call methods on its parent via _super.otherMethodName', function() {
      var parentBarCalled = false;

      var Klass1 = CoreObject.extend({
        bar: function() {
          parentBarCalled = true;
        }
      });

      var Klass2 = Klass1.extend({
        foo: function() {
          this._super.bar();
        }
      });

      var instance = new Klass2();

      instance.foo();
      assert(parentBarCalled, 'parent foo called');
    });

    it('all ancestors methods are available via _super.methodName', function() {
      var fooCalled = false;
      var barCalled = false;
      var bazCalled = false;

      var Klass1 = CoreObject.extend({
        foo: function() {
          fooCalled = true;
        }
      });

      var Klass2 = Klass1.extend({
        bar: function() {
          barCalled = true;
          this._super.foo();
        }
      });

      var Klass3 = Klass2.extend({
        baz: function() {
          bazCalled = true;
          this._super.foo();
        }
      });

      var instance = new Klass3();

      instance.baz();
      assert(fooCalled, 'foo called');
      assert(bazCalled, 'baz called');

      fooCalled = false;
      instance.bar();
      assert(fooCalled, 'foo called');
      assert(barCalled, 'bar called');
    });

    it('super chains work', function() {
      var fooCalled = false;
      var barCalled = false;
      var bazCalled = false;

      var Klass1 = CoreObject.extend({
        foo: function() {
          return 'klass1';
        },
        toString: function() {
          return 'klass1-' + this.id;
        }
      });

      var Klass2 = Klass1.extend({
        foo: function() {
          assert.equal(this.id, 4);
          return 'klass2,' + this._super();
        },
        toString: function() {
          return 'klass2-' + this.id + '.' + this._super();
        }
      });

      var Klass3 = Klass2.extend({
        init: function() {
          this.id = 4; // on the instance
        },
        toString: function() {
          assert.equal(this.foo(), 'klass2,klass1');
          return 'klass3-' + this.id + '.' + this._super();
        }
      });

      var instance = new Klass3();

      assert.equal(instance.toString(), 'klass3-4.klass2-4.klass1-4');
    });
  });
});
