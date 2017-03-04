var express = require('express');
var document_html = require('./document/html');
var fs = require('fs');
var $module = require('./module');
var mustache = require('mustache');
var path = require('path');

var levelPaths = {};
levelPaths[$module.Level.System]       = 'system';
levelPaths[$module.Level.Application]  = 'application';
levelPaths[$module.Level.Installation] = 'installation';

function render(layout, dawdModule, callback) {
  var document = new document_html.HTMLDocument();
  dawdModule.render(document, function(err) {
    if (err !== null) {
      callback(err, null);
      return;
    }
    var html;
    try {
      html = mustache.render(layout, {
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
  var layout = fs.readFileSync(process.argv[2], 'utf8');
  var app = express();
  process.argv.slice(3).forEach(function(dawdModulePath) {
    var dawdModule = require(path.resolve(dawdModulePath))($module);
    var levelPath = levelPaths[dawdModule.level];
    app.get('/report/' + levelPath + '/' + dawdModule.name, function(req, res) {
      render(layout, dawdModule, function(err, html) {
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
