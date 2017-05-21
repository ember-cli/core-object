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

  describe('descriptors', function() {
    it('copies them', function() {
      let fooTargetInvoked = 0;
      let fooInputInvoked = 0;

      let target = {
        get foo() {
          fooTargetInvoked++;
          return 'target';
        }
      };

      let input = {
        get foo() {
          fooInputInvoked++;
          return 'input';
        }
      };

      assignProperties(target, input);
      assert.equal(fooTargetInvoked, 0, 'exepcted accessor input.foo to not be accessed');
      assert.equal(fooInputInvoked, 0, 'exepcted accessor target.foo to not be accessed');
      assert.equal(target.foo, 'input');
    });

    it('copies them', function() {
      let fooTargetInvoked = 0;
      let fooInputInvoked = 0;

      let target = {
        get foo() {
          fooTargetInvoked++;
          return 'target';
        }
      };

      let input = {
        get foo() {
          fooInputInvoked++;
          return 'input';
        }
      };

      assignProperties(target, input);
      assert.equal(fooTargetInvoked, 0, 'exepcted accessor input.foo to not be accessed');
      assert.equal(fooInputInvoked, 0, 'exepcted accessor target.foo to not be accessed');
      assert.equal(target.foo, 'input');
    });

    it('sets super on gets', function() {
      let fooTargetInvoked = 0;
      let fooInputInvoked = 0;

      let target = {
        get foo() {
          fooTargetInvoked++;
          return 'target';
        }
      };

      let input = {
        get foo() {
          fooInputInvoked++;
          return 'input.' + this._super();
        }
      };

      assignProperties(target, input);

      assert.equal(fooTargetInvoked, 0, 'exepcted accessor input.foo to not be accessed');
      assert.equal(fooInputInvoked, 0, 'exepcted accessor target.foo to not be accessed');
      assert.equal(target.foo, 'input.target');
      assert.equal(fooTargetInvoked, 1);
      assert.equal(fooInputInvoked, 1);
    });


    it('sets super on sets', function() {
      let fooTargetInvoked = 0;
      let fooInputInvoked = 0;

      let target = {
        set foo(value) {
          fooTargetInvoked++;
          assert.equal(fooInputInvoked, 1);
          return value;
        }
      };

      let input = {
        set foo(value) {
          fooInputInvoked++;
          assert.equal(fooTargetInvoked, 0);
          this._super(value);
          assert.equal(fooTargetInvoked, 1);
          return value;
        }
      };

      assignProperties(target, input);

      assert.equal(fooTargetInvoked, 0, 'exepcted accessor input.foo to not be accessed');
      assert.equal(fooInputInvoked, 0, 'exepcted accessor target.foo to not be accessed');
      assert.equal(target.foo = 'apple', 'apple');
      assert.equal(fooTargetInvoked, 1);
      assert.equal(fooInputInvoked, 1);
    });
  });
});
