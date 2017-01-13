'use strict';

const CoreObject = require('../core-object');
const assert     = require('assert');

describe('extend', function() {
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
});


describe('extend ES6', function() {
  it('can be extended with functions to add to the new class', function() {
    let called = false;

    class Klass extends CoreObject {
      foo() {
        called = true;
      }
    };

    let instance = new Klass();
    instance.foo();

    assert(called);
  });

  it('can be provided a base object to `new`', function() {
    let called = false;

    class Klass extends  CoreObject {
      foo() {
        called = 'klass.foo';
      }
    };

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

    class Klass2 extends Klass1 {
      bar() {
        barCalled = true;
      }
    };

    let instance = new Klass2();
    instance.foo();
    assert(fooCalled);

    instance.bar();
    assert(barCalled);
  });
});
