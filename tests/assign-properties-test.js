'use strict';
var assert = require('assert');
var assignProperties = require('../lib/assign-properties');

describe('assignProperties', function() {
  it('noop', function() {
    var target = function() {};
    target.__protoMixin__ = {};
    target.__instanceMixin__ = {};
    var input = {};

    assignProperties(target, input);
    assert.deepEqual(target.__instanceMixin__, input);
    assert.deepEqual(target.__protoMixin__, input);
  });

  it('supports properties that do not conflict', function() {
    var target = function() {};
    target.__protoMixin__ = {};
    target.__instanceMixin__ = {};
    var input  = { a: 1, b: 2, c: []};

    assignProperties(target, input);
    assert.deepEqual(target.__instanceMixin__, input);
    assert.deepEqual(target.__protoMixin__, {});
  });

  it('supports properties that conflict', function() {
    var target = function() {};
    target.__protoMixin__ = {};
    target.__instanceMixin__ = {
      a: 2,
      c: [1]
    };
    var input  = { a: 1, b: 2, c: []};

    assignProperties(target, input);
    assert.deepEqual(target.__instanceMixin__, input);
    assert.deepEqual(target.__protoMixin__, {});
  });

  describe('super', function() {
    it('normal function', function() {
      var target = function() {};
      target.__protoMixin__ = {};
      target.__instanceMixin__ = {};
      var input = { a: function() { } }

      assignProperties(target, input);
      assert.deepEqual(target.__protoMixin__, input);
      assert.deepEqual(target.__instanceMixin__, {});
      assert.equal(target.__protoMixin__.a, input.a);
    });

    it('function with super but no root', function() {
      var target = function() {};
      target.__protoMixin__ = {};
      target.__instanceMixin__ = {};
      var input = {
        a: function() {
          this._super();
          return 5;
        }
      };

      assignProperties(target, input);
      assert.equal(target.__protoMixin__.a(), 5);
    });

    it('function with super with root', function() {
      var Target = function() {};
      Target.__protoMixin__ = {};
      Target.prototype = {
        a: function() {
          return 1;
        }
      };

      var input = {
        a: function() {
          return this._super() + 5;
        }
      };

      assignProperties(Target, input);
      for (var key in Target.__protoMixin__) {
        Target.prototype[key] = Target.__protoMixin__[key];
      }
      var target = new Target();
      assert.equal(target.a(), 6);
    });
  });

  // describe('super.methodName', function() {
  //   it('supported with deprecation notice', function() {
  //     var prevWarn = console.warn;
  //     var prevEnv = process.env.CORE_OBJECT_WARN_DEPRECATED;
  //     var warning;

  //     console.warn = function(msg) {
  //       warning = msg;
  //     };

  //     process.env.CORE_OBJECT_WARN_DEPRECATED = true;

  //     var Target = function() {};
  //     Target.__protoMixin__ = {};
  //     Target.prototype = {
  //       constructor: Target,

  //       a: function() {
  //         return 1;
  //       }
  //     };

  //     var input = {
  //       a: function() {
  //         return this._super.a.apply(this) + 5;
  //       }
  //     };

  //     assignProperties(Target, input);

  //     for (var key in Target.__protoMixin__) {
  //       Target.prototype[key] = Target.__protoMixin__[key];
  //     }

  //     var target = new Target();
  //     assert.equal(target.a(), 6);
  //     assert.equal(warning,
  //       'DEPRECATION: Calling this._super.a is deprecated. ' +
  //       'Please use this._super(args).');

  //     console.warn = prevWarn;
  //     process.env.CORE_OBJECT_WARN_DEPRECATED = prevEnv;
  //   });
  // });
});
