'use strict';

var document_html = require('./document/html');
var $module = require('./module');
var mustache = require('mustache');

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

function installModuleHandlers(dbPool, layout, app, dawdModule) {
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
}

module.exports = {
  installModuleHandlers: installModuleHandlers,
};
