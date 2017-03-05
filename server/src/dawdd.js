'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var $module = require('./module');
var moduleLoading = require('./moduleLoading');
var path = require('path');
var pg = require('pg');
var requestHandling = require('./requestHandling');

function main() {
  var dbPool = new pg.Pool({
    user: 'postgres',
    database: 'dawd',
    password: 'lol123',
    host: 'localhost',
    port: 5432,
    max: 16,
    idleTimeoutMillis: 30000,
  });
  var layout = fs.readFileSync(process.argv[2], 'utf8');
  var app = express();
  app.use(bodyParser.urlencoded({extended: false}));
  process.argv.slice(3).forEach(function(dawdModulePath) {
    var dawdModule = moduleLoading.loadModule(dawdModulePath);
    requestHandling.installModuleHandlers(dbPool, layout, app, dawdModule);
  });
  app.listen(1337, '0.0.0.0', function() {
  });
}

module.exports = {
  main: main,
};
