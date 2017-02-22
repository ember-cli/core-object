'use strict';

const assert = require('assert');
const CoreObject = require('../core-object');

describe('mixin', function() {
  it('noop', function() {
    let target = {};
    let mixinObj = {};

    CoreObject.mixin(target, mixinObj);
    assert.deepEqual(target, mixinObj);
  });

  it('target object wins during conflict', function() {
    let target = { a: 2, c: [1]};
    let mixinObj  = { a: 1, b: 2, c: []};

    CoreObject.mixin(target, mixinObj);
    assert.equal(target.a, 2);
    assert.deepEqual(target.c, [1]);
    assert.equal(target.b, 2);
  });

  it('falsy value on target still wins during conflict', function() {
    let target = { a: 1, b: null };
    let mixinObj  = { b: 2 };

    CoreObject.mixin(target, mixinObj);
    assert.equal(target.b, null);
  });

  it('undefined value on target still wins during conflict', function() {
    let target = { a: 1, b: undefined };
    let mixinObj  = { b: 2 };

    CoreObject.mixin(target, mixinObj);
    assert.equal(target.b, undefined);
  });

  it('deleted value on target can be overwritten', function() {
    let target = { a: 1, b: 11 };
    let mixinObj  = { b: 2 };

    delete target.b;

    CoreObject.mixin(target, mixinObj);
    assert.equal(target.b, 2);
  });

  describe('super', function() {
    it('can call super', function() {
      let mixinObj = {
        number: function() {
          return 2;
        }
      };

      let target = {
        number: function() {
          return this._super.number() + 1;
        }
      }

      CoreObject.mixin(target, mixinObj);

      assert.equal(target.number(), 3);
    });

    it('super fuction has correct context', function() {
      let mixinObj = {
        anchor: 3,
        number: function() {
          return this.anchor;
        }
      };

      let target = {
        anchor: 10,
        number: function() {
          return this._super.number() + 10;
        }
      }

      CoreObject.mixin(target, mixinObj);

      assert.equal(target.number(), 13);
    });

    it('target fuction has correct context', function() {
      let mixinObj = {
        anchor: 3,
        number: function() {
          return this.anchor;
        }
      };

      let target = {
        anchor: 10,
        number: function() {
          return this._super.number() + this.anchor;
        }
      }

      CoreObject.mixin(target, mixinObj);

      assert.equal(target.number(), 13);
    });

    it('target fuction has correct context', function() {
      let mixinObj = {
        anchor: 3,
        number: function() {
          return this.anchor;
        }
      };

      let target = {
        anchor: 10,
        number: function() {
          return this._super.number() + this.anchor;
        }
      }

      CoreObject.mixin(target, mixinObj);

      assert.equal(target.number(), 13);
    });
  });
});