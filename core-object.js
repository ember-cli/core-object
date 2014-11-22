'use strict';

var assign = require('lodash-node/modern/objects/assign');

function CoreObject(options) {
  this.init(options);
}

CoreObject.prototype.init = function(options) {
  if (options) {
    for (var key in options) {
      this[key] = options[key];
    }
  }
};

module.exports = CoreObject;

CoreObject.extend = function(options) {
  var constructor = this;

  function Class() {
    var length = arguments.length;

    if (length === 0) this.init();
    else this.init(arguments[0]);
  }

  Class.__proto__ = CoreObject;

  Class.prototype = Object.create(constructor.prototype);
  if (options) assign(Class.prototype, options);
  Class.prototype._super = constructor.prototype;

  return Class;
};
