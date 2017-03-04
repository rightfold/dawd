'use strict';

var express = require('express');
var document_html = require('./document/html');
var fs = require('fs');
var $module = require('./module');
var mustache = require('mustache');
var path = require('path');
var pg = require('pg');

var levelPaths = {};
levelPaths[$module.Level.System]       = 'system';
levelPaths[$module.Level.Application]  = 'application';
levelPaths[$module.Level.Installation] = 'installation';

function render(dbPool, layout, dawdModule, $arguments, callback) {
  var document = new document_html.HTMLDocument(dbPool);
  dawdModule.render($arguments, document, function(err) {
    if (err !== null) {
      callback(err, null);
      return;
    }
    var html;
    try {
      html = mustache.render(layout, {
        title: document.title,
        body: document.html,
      });
    } catch (e) {
      callback(e, null);
      return;
    }
    callback(null, html);
  });
}

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
  process.argv.slice(3).forEach(function(dawdModulePath) {
    var dawdModule = require(path.resolve(dawdModulePath))($module);
    var levelPath = levelPaths[dawdModule.level];
    app.get('/report/' + levelPath + '/' + dawdModule.name, function(req, res) {
      render(dbPool, layout, dawdModule, req.query, function(err, html) {
        if (err !== null) {
          res.status(500);
          res.end();
          return;
        }
        res.contentType('text/html');
        res.end(html);
      });
    });
  });
  app.listen(1337, '0.0.0.0', function() {
  });
}

module.exports = {
  main: main,
};
