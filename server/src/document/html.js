function HTMLDocument() {
  this.html = '';
}

HTMLDocument.prototype.write = function(text) {
  this.html += '<p>';
  this.html += text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  this.html += '</p>';
};

module.exports = {
  HTMLDocument: HTMLDocument,
};
