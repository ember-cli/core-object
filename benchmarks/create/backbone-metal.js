var Class = require('backbone-metal').Class;
var setup = require('./_setup');

var name = 'backbone-metal/create';

var Person = Class.extend({

});

function fn() {
  return new Person(this.data);
}

module.exports.fn    = fn;
module.exports.name  = name;
module.exports.setup = setup;
