'use strict';

const CoreObject = require('../core-object');
const assert = require('assert');

describe('constructor', function() {
  it('mixes', function() {
    let bConstructorCalled = 0;
    let aInitCalled =0;

    const A = CoreObject.extend({
      init() {
        aInitCalled++;
      }
    });

    class B extends A {
      constructor() {
        bConstructorCalled++;
        super();
      }

    };
    const C = B.extend({ });

    assert(bConstructorCalled === 0);
    assert(aInitCalled === 0);

    const c = new C();

    assert(bConstructorCalled === 1);
    assert(aInitCalled === 1);
  })
})
