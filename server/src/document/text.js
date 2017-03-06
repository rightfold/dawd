'use strict';

var $module = require('../module');

function TextDocument() {
  this.text = '';
}

TextDocument.prototype.formAutomatic = function(moduleType, moduleLevel, moduleName, moduleParameters) {
};

TextDocument.prototype.setTitle = function(text) {
};

TextDocument.prototype.write = function(text) {
  this.text += text + '\n';
};

TextDocument.prototype.sqlTable = function(dbPool, query, $arguments, callback) {
  var self = this;
  dbPool.connect(function(err, client, done) {
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
      self.text += result.fields.map(function(field) {
        return field.name;
      }).join('\t') + '\n';
      result.rows.forEach(function(row) {
        self.text += row.join('\t') + '\n';
      });
      callback(null);
    });
  });
};

module.exports = {
  TextDocument: TextDocument,
};
