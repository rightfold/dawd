var express = require('express');
var document_html = require('./document/html');
var $module = require('./module');
var path = require('path');

var levelPaths = {};
levelPaths[$module.Level.System]       = 'system';
levelPaths[$module.Level.Application]  = 'application';
levelPaths[$module.Level.Installation] = 'installation';

function main() {
  var app = express();
  process.argv.slice(2).forEach(function(dawdModulePath) {
    var dawdModule = require(path.resolve(dawdModulePath))($module);
    var levelPath = levelPaths[dawdModule.level];
    app.get('/report/' + levelPath + '/' + dawdModule.name, function(req, res) {
      var document = new document_html.HTMLDocument();
      dawdModule.render(document, function(err) {
        if (err !== null) {
          res.status(500);
          res.end();
          return;
        }
        res.contentType('text/html');
        res.end(document.html);
      });
    });
  });
  app.listen(1337, '0.0.0.0', function() {
  });
}

module.exports = {
  main: main,
};
