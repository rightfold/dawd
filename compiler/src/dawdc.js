var fs = require('fs');
var parse = require('./parse');
var util = require('util');

function main() {
  var text = fs.readFileSync(process.argv[2], 'utf8');
  var ast = parse.parse(text);
  console.log(util.inspect(ast, false, null, true));
}

module.exports = {
  main: main,
};
