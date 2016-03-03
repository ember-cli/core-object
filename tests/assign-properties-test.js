var assert = require('assert');
var assignProperties = require('../lib/assign-properties');

describe('assignProperties', function() {
  it('noop', function() {
    var target = {};
    var input = {};

    assignProperties(target, input);
    assert.deepEqual(target, input);
  });

  it('supports properties that do not conflict', function() {
    var target = {};
    var input  = { a: 1, b: 2, c: []};

    assignProperties(target, input);
    assert.deepEqual(target, input);

    assert.deepEqual(target, input);
  });

  it('supports properties that conflict', function() {
    var target = { a: 2, c: [1]};
    var input  = { a: 1, b: 2, c: []};

    assignProperties(target, input);
    assert.deepEqual(target, input);

    assert.deepEqual(target, input);
  });

  describe('super', function() {
    it('normal function', function() {
      var target = { };
      var input = { a: function() { } }

      assignProperties(target, input);
      assert.deepEqual(target, input);

      assert.deepEqual(target, input);
      assert.equal(target.a, input.a);
    });

    it('function with super but no root', function() {
      var target = { };
      var input = {
        a: function() {
          this._super();
          return 5;
        }
      };

      assignProperties(target, input);
      assert.equal(target.a(), 5);
    });

    it('function with super.a but no root', function() {
      var target = { };
      var input = {
        a: function() {
          this._super.a();
          return 5;
        }
      };

      assignProperties(target, input);
      assert.equal(target.a(), 5);
    });

    it('function with super with root', function() {
      var target = {
        a: function() {
          return 1;
        }
      };
      var input = {
        a: function() {
          return this._super() + 5;
        }
      };

      assignProperties(target, input);
      assert.equal(target.a(), 6);
    });


    it('function with super with root', function() {
      var target = {
        a: function() {
          return 1;
        }
      };
      var input = {
        a: function() {
          return this._super.a() + 5;
        }
      };

      assignProperties(target, input);
      assert.equal(target.a(), 6);
    });
  });
});
