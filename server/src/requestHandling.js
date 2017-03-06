'use strict';

var document_html = require('./document/html');
var document_text = require('./document/text');
var $module = require('./module');
var mustache = require('mustache');

function requestMethod(dawdModule) {
  if (dawdModule instanceof $module.ActionModule) {
    return 'post';
  }
  if (dawdModule instanceof $module.ReportModule) {
    return 'get';
  }
  throw Error('Unknown module class: ' + dawdModule.constructor.name);
}

function requestArguments(dawdModule, req) {
  if (dawdModule instanceof $module.ActionModule) {
    return req.body;
  }
  if (dawdModule instanceof $module.ReportModule) {
    return req.query;
  }
  throw Error('Unknown module class: ' + dawdModule.constructor.name);
}

function renderHTML(dbPool, layout, dawdModule, $arguments, callback) {
  var document = new document_html.HTMLDocument();
  dawdModule.render(dbPool, $arguments, document, function(err) {
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

function renderText(dbPool, layout, dawdModule, $arguments, callback) {
  var document = new document_text.TextDocument();
  dawdModule.render(dbPool, $arguments, document, function(err) {
    if (err !== null) {
      callback(err, null);
      return;
    }
    callback(null, document.text);
  });
}

function installModuleHandlers(dbPool, layout, app, dawdModule) {
  var method = requestMethod(dawdModule);

  var moduleTypePath = $module.moduleTypePathSegment(dawdModule);
  var levelPath = $module.levelPathSegment(dawdModule.level);
  var basePath = '/' + moduleTypePath + '/' + levelPath + '/' + dawdModule.name;

  register(basePath, 'text/html', renderHTML);
  register(basePath + '.html', 'text/html', renderHTML);
  register(basePath + '.txt', 'text/plain', renderText);

  function register(path, contentType, render) {
    app[method](path, function(req, res) {
      var $arguments = requestArguments(dawdModule, req);
      render(dbPool, layout, dawdModule, $arguments, function(err, body) {
        if (err !== null) {
          res.status(500);
          res.end();
          return;
        }
        res.contentType(contentType);
        res.end(body);
      });
    });
  }
}

module.exports = {
  installModuleHandlers: installModuleHandlers,
};
