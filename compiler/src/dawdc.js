'use strict';

var ast = require('./ast');
var check = require('./check');
var codegen = require('./codegen');
var fs = require('fs');
var parse = require('./parse');
var path = require('path');
var shiftCodegen = require('shift-codegen');
var util = require('util');

function main() {
  var sourcePath = process.argv[2];

  var text = fs.readFileSync(sourcePath, 'utf8');

  var $ast = parse.parse(text);
  console.log(util.inspect($ast, false, null, true));

  var context = new check.Context();
  $ast.forEach(function($module) {
    check.checkModule(context, $module);
  });

  $ast.forEach(function($module) {
    var esAST = codegen.codegenModule($module, ast.Level.Application);
    var esSource = shiftCodegen.default(esAST);
    var esPath = path.dirname(sourcePath) + '/' + $module.name + '.js';
    fs.writeFileSync(esPath, esSource);
  });
}

module.exports = {
  main: main,
};
