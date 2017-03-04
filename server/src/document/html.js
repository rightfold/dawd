'use strict';

function escape(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function HTMLDocument(dbPool) {
  this._dbPool = dbPool;
  this.html = '';
}

HTMLDocument.prototype.write = function(text) {
  this.html += '<p>';
  this.html += escape(text);
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
