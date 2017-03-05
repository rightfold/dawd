'use strict';

var $module = require('../module');

function escape(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function HTMLDocument(dbPool) {
  this._dbPool = dbPool;
  this.title = '';
  this.html = '';
}

HTMLDocument.prototype.formAutomatic = function(moduleType, moduleLevel, moduleName, moduleParameters) {
  var self = this;
  var method;
  switch (moduleType) {
    case $module.Type.Action:
      method = 'post';
      break;
    case $module.Type.Report:
      method = 'get';
      break;
  }
  this.html += '<form method="' + method + '" action="/'
    + $module.moduleTypePathSegment(moduleType) + '/'
    + $module.levelPathSegment(moduleLevel) + '/'
    + moduleName + '">';
  moduleParameters.forEach(function(parameter) {
    self.html += '<input type="text" name="' + parameter + '">';
  });
  this.html += '<input type="submit">'
  this.html += '</form>';
};

HTMLDocument.prototype.setTitle = function(text) {
  this.title = text;
};

HTMLDocument.prototype.write = function(text) {
  this.html += '<p>';
  this.html += escape(text).replace(/\n/g, '<br>');
  this.html += '</p>';
};

HTMLDocument.prototype.sqlTable = function(query, $arguments, callback) {
  var self = this;
  this._dbPool.connect(function(err, client, done) {
    if (err !== null) {
      callback(err);
      return;
    }
    client.query({
      text: query,
      values: $arguments,
      rowMode: 'array',
    }, function(err, result) {
      done(err);
      if (err !== null) {
        callback(err);
        return;
      }
      self.html += '<table>';
      self.html += '<thead>';
      self.html += '<tr>';
      result.fields.forEach(function(field) {
        self.html += '<th>';
        self.html += escape(field.name);
        self.html += '</th>';
      });
      self.html += '</tr>';
      self.html += '</thead>';
      self.html += '<tbody>';
      result.rows.forEach(function(row) {
        self.html += '<tr>';
        row.forEach(function(cell) {
          self.html += '<td>';
          self.html += escape('' + cell);
          self.html += '</td>';
        });
        self.html += '</tr>';
      });
      self.html += '</tbody>';
      self.html += '</table>';
      callback(null);
    });
  });
};

module.exports = {
  HTMLDocument: HTMLDocument,
};
