require('./get-own-property-descriptors');
var deprecation = require('./deprecation');


function setPrototypeOf(obj, proto) {
  Object.setPrototypeOf ? Object.setPrototypeOf(obj, proto) : obj.__proto__ = proto;
}

function getPrototypeOf(obj, proto) {
  return Object.getPrototypeOf ? Object.getPrototypeOf(obj) : obj.__proto__;
}

function hasGetter(descriptor) {
  return descriptor.hasOwnProperty('get') && descriptor.get !== undefined;
}

function hasSetter(descriptor) {
  return descriptor.hasOwnProperty('set') && descriptor.set !== undefined;
}

function giveMethodSuper(superclass, name, fn) {
  return function superWrapper() {
    var superFn;

    if (superclass[name]) {
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

    var previous = this._super;
    this._super = superFn;
    var ret = fn.apply(this, arguments);
    this._super = previous;
    return ret;
  };
}

var sourceAvailable = (function() {
  return this;
}).toString().indexOf('return this') > -1;

var hasSuper;
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

function mergeDescriptors(descriptor, targetDescriptor) {
  if (descriptor.hasOwnProperty('value') || !targetDescriptor) {
    return descriptor;
  }

  if ( !hasGetter(descriptor) && hasGetter(targetDescriptor) ) {
    descriptor.get = targetDescriptor.get;
  }

  if ( !hasSetter(descriptor) && hasSetter(targetDescriptor) ) {
    descriptor.set = targetDescriptor.set;
  }

  return descriptor;
}

function assignProperties(target, options) {
  var optionDescriptors  = Object.getOwnPropertyDescriptors(options),
      targetDescriptors  = Object.getOwnPropertyDescriptors(getPrototypeOf(target)),
      propertiesToDefine = {},
      value, descriptor, targetDescriptor;

  for (var key in options) {
    descriptor = optionDescriptors[key];
    value = descriptor.value;

    if (typeof value === 'function' && hasSuper(value)) {
      target[key] = giveMethodSuper(getPrototypeOf(target), key, value);
    } else {
      targetDescriptor = targetDescriptors[key];
      propertiesToDefine[key] = mergeDescriptors(descriptor, targetDescriptor);
    }
  }

  if (Object.keys(propertiesToDefine).length) {
    Object.defineProperties(target, propertiesToDefine);
  }
}

module.exports = assignProperties;
