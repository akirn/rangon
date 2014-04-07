'use strict';

var env = {
  dev: {
    mode: 'dev',
    port: 3000
  },
  staging: {
    mode: 'staging',
    port: 4000
  },
  production: {
    mode: 'production',
    port: 5000
  }
};

module.exports = function(mode) {
  return env[mode || process.argv[2] || 'dev'] || env.dev;
};