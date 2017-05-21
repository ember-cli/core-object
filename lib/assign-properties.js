'use strict';

const deprecation = require('./deprecation');

function setPrototypeOf(obj, proto) {
  Object.setPrototypeOf ? Object.setPrototypeOf(obj, proto) : obj.__proto__ = proto;
}

function getPrototypeOf(obj, proto) {
  return Object.getPrototypeOf ? Object.getPrototypeOf(obj) : obj.__proto__;
}

function giveMethodSuper(superclass, name, fn) {
  return function superWrapper() {
    let superFn;

    if (typeof superclass[name] === 'function') {
      superFn = function() {
        return superclass[name].apply(this, arguments);
      }
    } else {
      superFn = function() {};
    }

    // #yolo
    setPrototypeOf(superFn, superclass);
    superFn.apply = Function.prototype.apply;
    superFn.call = Function.prototype.call;
    superFn.bind = Function.prototype.bind;
    superFn[name] = superclass[name] || function rootSuper() {};

    const previous = this._super;
    this._super = superFn;
    const ret = fn.apply(this, arguments);
    this._super = previous;
    return ret;
  };
}

const sourceAvailable = (function() {
  return this;
}).toString().indexOf('return this') > -1;

let hasSuper;
if (sourceAvailable) {
  hasSuper = function(fn) {
    if (fn.__hasSuper === undefined) {
     return fn.__hasSuper = fn.toString().indexOf('_super') > -1;
    } else {
     return fn.__hasSuper;
    }
  }
} else {
  hasSuper = function(target, fn) {
    return true;
  }
}

function giveAccessorSuper(descriptor, name, target) {
  let old = descriptor[name];
  let superMethod = target[name];

  descriptor[name] = function() {
    this._super = superMethod;
    return old.apply(this, arguments);
  }
}

module.exports = function assignProperties(target, options) {
  let value;

  Object.getOwnPropertyNames(options).forEach(key => {
    let descriptor = Object.getOwnPropertyDescriptor(options, key);
    let value = descriptor.value;

    if (typeof value === 'function' && hasSuper(value)) {
      descriptor.value = giveMethodSuper(getPrototypeOf(target), key, value);
    } else if (value === undefined){
      if (typeof descriptor.get === 'function' && hasSuper(descriptor.get)) {
        giveAccessorSuper(descriptor, 'get', Object.getOwnPropertyDescriptor(target, key));
      }

      if (typeof descriptor.set === 'function' && hasSuper(descriptor.set)) {
        giveAccessorSuper(descriptor, 'set', Object.getOwnPropertyDescriptor(target, key));
      }
    }

    Object.defineProperty(target, key, descriptor);
  });

};
