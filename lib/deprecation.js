'use strict';

var env = require('./env');
var chalk = require('chalk');

module.exports = function deprecation(msg) {
  if (env.CORE_OBJECT_WARN_DEPRECATED) {
    var error = new Error();
    var stack = error.stack.split(/\n/);
    var source = stack[3];

    console.warn(chalk.yellow('DEPRECATION: ' + msg + '\n' + source));
  }
};
