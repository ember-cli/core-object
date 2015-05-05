var env = require('./env');

function deprecation(msg) {
  if (env.CORE_OBJECT_WARN_DEPRECATED) {
    console.warn('DEPRECATION: ' + msg);
  }
}

module.exports = deprecation;
