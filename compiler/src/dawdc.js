'use strict';

var ast = require('./ast');
var check = require('./check');
var codegen = require('./codegen');
var fs = require('fs');
var parse = require('./parse');
var shiftCodegen = require('shift-codegen');
var util = require('util');

function main() {
  var text = fs.readFileSync(process.argv[2], 'utf8');
  var $ast = parse.parse(text);
  console.error(util.inspect($ast, false, null, true));
  check.checkModule($ast);
  console.log(shiftCodegen.default(codegen.codegenModule($ast, ast.Level.Application)));
}

module.exports = {
  main: main,
};
