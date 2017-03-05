'use strict';

var $module = require('./module');
var path = require('path');

function loadModule($path) {
  return require(path.resolve($path))($module);
}

module.exports = {
  loadModule: loadModule,
};
