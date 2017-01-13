'use strict';

const CoreObject = require('../core-object');
const assert     = require('assert');

describe('core-object.js', function() {
  it('errors if new is not used', function() {
    assert.throws(function() {
      CoreObject();
    }, /without 'new'/);

  });

  it('can be extended with functions to add to the new class', function() {
    let called = false;

    let Klass = CoreObject.extend({
      foo() {
        called = true;
      }
    });

    let instance = new Klass();
    instance.foo();

    assert(called);
  });

  it('can be provided a base object to `new`', function() {
    let called = false;

    let Klass = CoreObject.extend({
      foo() {
        called = 'klass.foo';
      }
    });

    let instance = new Klass({
      foo() {
        called = 'instance.foo';
      }
    });

    instance.foo();

    assert.equal(called, 'instance.foo');
  });

  it('an extended class can be extended with functions to add to the new class', function() {
    let fooCalled = false;
    let barCalled = false;

    let Klass1 = CoreObject.extend({
      foo() {
        fooCalled = true;
      }
    });

    let Klass2 = Klass1.extend({
      bar() {
        barCalled = true;
      }
    });

    let instance = new Klass2();
    instance.foo();
    assert(fooCalled);

    instance.bar();
    assert(barCalled);
  });

  describe('init', function(){

    it('init is called with the arguments to new', function() {
      let called = false;

      let Klass = CoreObject.extend({
        init(foo) {
          called = foo;
        }
      });

      let instance = new Klass('foo');

      assert.equal(called, 'foo');
    });

    it('init is called once when we instantiate a grandchild class', function() {
      let called = 0;

      let Klass1 = CoreObject.extend({});

      let Klass2 = Klass1.extend({
        init(){
          called += 1;
        }
      });

      let instance = new Klass2();

      assert.equal(called, 1);
    });
  });
});
