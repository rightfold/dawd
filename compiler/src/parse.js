var grammar = require('./grammar');

function parse(text) {
  return grammar.parser.parse(text);
}

module.exports = {
  parse: parse,
};
