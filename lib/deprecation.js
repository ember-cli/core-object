var env = require('./env');

function deprecation(msg) {
  if (env.CORE_OBJECT_WARN_DEPRECATED) {
    var error = new Error();
    var stack = error.stack.split(/\n/);
    var source = stack[3];
    console.warn('Deprecation: ' + msg + '\n' + source);
  }
}

module.exports = deprecation;
