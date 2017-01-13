'use strict';

const assert = require('assert');
const assignProperties = require('../lib/assign-properties');

describe('assignProperties', function() {
  it('noop', function() {
    let target = {};
    let input = {};

    assignProperties(target, input);
    assert.deepEqual(target, input);
  });

  it('supports properties that do not conflict', function() {
    let target = {};
    let input  = { a: 1, b: 2, c: []};

    assignProperties(target, input);
    assert.deepEqual(target, input);

    assert.deepEqual(target, input);
  });

  it('supports properties that conflict', function() {
    let target = { a: 2, c: [1]};
    let input  = { a: 1, b: 2, c: []};

    assignProperties(target, input);
    assert.deepEqual(target, input);

    assert.deepEqual(target, input);
  });

  describe('super', function() {
    it('normal function', function() {
      let target = { };
      let input = { a() { } };

      assignProperties(target, input);
      assert.deepEqual(target, input);

      assert.deepEqual(target, input);
      assert.equal(target.a, input.a);
    });

    it('function with super but no root', function() {
      let target = { };
      let input = {
        a() {
          this._super();
          return 5;
        }
      };

      assignProperties(target, input);
      assert.equal(target.a(), 5);
    });

    it('function with super.a but no root', function() {
      let target = { };
      let input = {
        a() {
          this._super.a();
          return 5;
        }
      };

      assignProperties(target, input);
      assert.equal(target.a(), 5);
    });
  });
});
