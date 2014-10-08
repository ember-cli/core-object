'use strict';

var assign = require('lodash-node/modern/objects/assign');

function CoreObject(options) {
  assign(this, options);
}

module.exports = CoreObject;

CoreObject.prototype.constructor = CoreObject;

CoreObject.extend = function(options) {
  var constructor = this;

  function Class() {
    var args = new Array(arguments.length);
    for (var i = 0, l = args.length; i < l; i++) {
      args[i] = arguments[i];
    }

    if (!(this instanceof Class)) {
      var instance = new MissingNew();
      Class.apply(instance, args);

      return instance;
    }

    constructor.apply(this, args);
    if (this.init) {
      this.init.apply(this, args);
    }
  }

  Class.__proto__ = CoreObject;

  Class.prototype = Object.create(constructor.prototype);
  assign(Class.prototype, options);
  Class.prototype.constructor = Class;
  Class.prototype._super = constructor.prototype;

  function MissingNew() {};
  MissingNew.prototype = Class.prototype;

  return Class;
};

