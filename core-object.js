'use strict';

var assignProperties = require('./lib/assign-properties');
var deprecation = require('./lib/deprecation');

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
  var constructor = this;

  function Class() {
    var length = arguments.length;

    if (length === 0)      this.init();
    else if (length === 1) this.init(arguments[0]);
    else                   this.init.apply(this, arguments);
  }

  Class.__proto__ = CoreObject;

  Class.prototype = Object.create(constructor.prototype);

  if (options) {
    if (shouldCallSuper(options.init)) {
      deprecation(
        'Overriding init without calling this._super is deprecated. ' +
        'Please call this._super.apply(this, arguments).'
      );
      options.init = forceSuper(options.init);
    }
    assignProperties(Class.prototype, options);
  }

  return Class;
};

/* global define:true module:true window: true */
if (typeof define === 'function' && define['amd'])      { define(function() { return CoreObject; }); }
if (typeof module !== 'undefined' && module['exports']) { module['exports'] = CoreObject; }
if (typeof window !== 'undefined')                      { window['CoreObject'] = CoreObject; }

function shouldCallSuper(fn) {
  // No function, no problem
  if (!fn) { return false; }

  // Takes arguments, assume disruptive override
  if (/^function *\( *[^ )]/.test(fn)) { return false; }

  // Calls super already, good to go
  if (/this\._super.init\(/.test(fn)) { return false; }
  if (/this\._super\(/.test(fn)) { return false; }
  if (/this\._super\.call\(/.test(fn)) { return false; }
  if (/this\._super\.apply\(/.test(fn)) { return false; }

  return true;
}

function forceSuper(fn) {
  return function() {
    this._super.apply(this, arguments);
    fn.apply(this, arguments);
  }
}
