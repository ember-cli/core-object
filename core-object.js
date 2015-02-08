'use strict';

var assignProperties = require('./lib/assign-properties');
var Mixin = require('./mixin').Mixin;

function needsNew() {
  throw new TypeError("Failed to construct: Please use the 'new' operator, this object constructor cannot be called as a function.");
}

function CoreObject(options) {
  if (!(this instanceof CoreObject)) {
    needsNew()
  }
  this.init(options);
}

CoreObject.prototype.init = function(options) {
  if (options) {
    for (var key in options) {
      this[key] = options[key];
    }
  }
};

CoreObject.extend = function(options) {
  var methodBag;
  function Class() {
    var length = arguments.length;
    var protoMixin = Class.__protoMixin__;
    var instanceMixin = Class.__instanceMixin__;
    Class.wasApplied = true;

    protoMixin.apply(this);

    for (var key in instanceMixin) {
      var value = instanceMixin[key];
      this[key] = value;
    }

    if (length === 0)      this.init();
    else if (length === 1) this.init(arguments[0]);
    else                   this.init.apply(this, arguments);
  }

  Class.superClass = this;
  Class.__protoMixin__ = new Mixin(Class.superClass.__protoMixin__);
  Class.__instanceMixin__ = {};
  Class.__proto__ = CoreObject;
  methodBag = {};
  
  for (var key in options) {
    var value = options[key];
    if (typeof value === 'function') {
      methodBag[key] = value;
    } else {
      Class.__instanceMixin__[key] = value;
    }
  }

  Class.__protoMixin__.add(methodBag);
  Class.wasApplied = false;

  // Create the prototype
  Class.prototype = Object.create(Class.superClass.prototype);

  return Class;
};

CoreObject.reopen = function(options) {
  if (this.wasApplied) {
    throw Error('You attempted to reopen a class that has already been instantiated.');
  }

  this.__protoMixin__.add(options);
};

/* global define:true module:true window: true */
if (typeof define === 'function' && define['amd'])      { define(function() { return CoreObject; }); } 
if (typeof module !== 'undefined' && module['exports']) { module['exports'] = CoreObject; } 
if (typeof window !== 'undefined')                      { window['CoreObject'] = CoreObject; }
