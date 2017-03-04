var check = require('./check');
var fs = require('fs');
var parse = require('./parse');
var util = require('util');

function main() {
  var text = fs.readFileSync(process.argv[2], 'utf8');
  var ast = parse.parse(text);
  check.checkModule(ast);
  console.log(util.inspect(ast, false, null, true));
}

module.exports = {
  main: main,
};
