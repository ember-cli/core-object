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
  });

  describe('super.methodName', function() {
    it('supported with deprecation notice', function() {
      var prevWarn = console.warn;
      var prevEnv = process.env.CORE_OBJECT_WARN_DEPRECATED;
      var warning;

      console.warn = function(msg) {
        warning = msg;
      }

      process.env.CORE_OBJECT_WARN_DEPRECATED = true;

      var target = {
        a: function() {
          return 1;
        }
      };

      var input = {
        a: function() {
          return this._super.a.apply(this) + 5;
        }
      };

      assignProperties(target, input);

      assert.equal(target.a(), 6);
      assert.ok(warning.indexOf('Calling this._super.a is deprecated.') !== -1);

      console.warn = prevWarn;

      // Assignments in process.env get stringified so we have
      // to be careful not to inadvertently assign the string
      // 'undefined' or 'null'.
      if (prevEnv) {
        process.env.CORE_OBJECT_WARN_DEPRECATED = prevEnv;
      } else {
        delete process.env.CORE_OBJECT_WARN_DEPRECATED;
      }
    });
  });
});
