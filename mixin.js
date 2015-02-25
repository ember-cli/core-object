'use strict';
var arrSlice = [].slice;

function hasSuper(fn) {
  if (fn.__hasSuper === undefined) {
    fn.__hasSuper = fn.toString().indexOf('_super') > -1;
  }

  return fn.__hasSuper;
}

function superWrap(mixin, name, fn) {
  var superFn = mixin[name];

  if (typeof superFn !== 'function') {
    superFn = function() {};
  }

  return function() {
    var previous = this._super;
    this._super = superFn;
    var ret = fn.apply(this, arguments);
    this._super = previous;
    return ret;
  };
}

function Mixin() {
  var length = arguments.length;

  if (length === 1 && !(arguments[0] instanceof Mixin)) {
    this.properties = arguments[0];
    this.mixins = undefined;
  } else if (length >= 1) {
    this.mixins = [];
    for (var i = 0; i < length; i++) {
      var x = arguments[i];
      if (x instanceof Mixin) {
        this.mixins.push(x);
      } else {
        this.mixins.push(new Mixin(x));
      }
    }
  } else {
    this.properties = undefined;
    this.mixins = undefined;
  }   
}

Mixin.prototype.apply = function(target) {
  return assign([this], target);
};

Mixin.prototype.add = function(target) {
  if (!this.mixins) {
    this.mixins = [];
  }

  if (target instanceof Mixin) {
    this.mixins.push(target);
  } else {
    this.mixins.push(new Mixin(target));
  }
};

function mixinProperties(mixin) {
  if (mixin instanceof Mixin) {
    return mixin.properties;
  } else {
    return mixin;
  }
}

function assign(mixins, target) {
  for(var i = 0, l = mixins.length; i < l; i++) {
    var currentMixin = mixins[i];
    var props = mixinProperties(currentMixin);

    if (props) {
      for (var k in props) {
        var value = props[k];

        if (!props.hasOwnProperty(k)) {
          continue;
        }

        if(typeof value === 'function' && hasSuper(value)) {
          target[k] = superWrap(target, k, value);
        } else {
          target[k] = value;
        }
        
      }

    } else if (currentMixin.mixins) {
      assign(currentMixin.mixins, target);
    }
  }

  return target;
}

function mixin(obj) {
  var mixins = arrSlice.call(arguments, 1);
  return assign(mixins, obj);
}

module.exports = {
  Mixin: Mixin,
  mixin: mixin
};