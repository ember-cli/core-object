function giveMethodSuper(target, fn) {
  return function() {
    var previous = this._super;
    this._super = target;
    var ret = fn.apply(this, arguments);
    this._super = previous;
    return ret;
  };
}

var sourceAvailable = (function() {
    return this;
}).toString().indexOf('return this;') > -1;

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

function assignProperties(target, options) {
  var value;
  for (var key in options) {
    value = options[key];

    if (typeof value === 'function' &&
        typeof target[key] === 'function' && hasSuper(value)) {
      target[key] = giveMethodSuper(target[key], value);
    } else {
      target[key] = value;
    }
  }
}

module.exports = assignProperties;
