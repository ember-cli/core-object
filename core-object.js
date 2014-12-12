'use strict';

var assign = require('lodash-node/modern/objects/assign');

function CoreObject(options) {
  this.init(options);
}

CoreObject.prototype.init = function(options) {
  assign(this, options);
};

module.exports = CoreObject;

CoreObject.extend = function(options) {
  var constructor = this;

  function Class() {
    this.init.apply(this, arguments);
  }

  Class.__proto__ = CoreObject;

  Class.prototype = Object.create(constructor.prototype);
  assign(Class.prototype, options);
  Class.prototype._super = constructor.prototype;

  return Class;
};
