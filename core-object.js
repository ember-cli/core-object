'use strict';

var assign = require('lodash-node/modern/objects/assign');

function CoreObject(options) {
  assign(this, options);
}

module.exports = CoreObject;


CoreObject.extend = function(options) {
  var constructor = this;

  function Class() {
    var args = new Array(arguments.length);
    var i = 0;
    var l = args.length;
    for (; i < l; i++) {
      args[i] = arguments[i];
    }

    var object = this;
    CoreObject.apply(object, args);
    if (object.init) {
      object.init.apply(object, args);
    }
  }

  Class.__proto__ = CoreObject;

  Class.prototype = Object.create(constructor.prototype);
  assign(Class.prototype, options);
  Class.prototype._super = constructor.prototype;

  return Class;
};
