'use strict';

var ast = require('./ast');
var type = require('./type');

function checkModule($module) {
  if ($module instanceof ast.ReportModule) {
    return checkReportModule($module);
  }
  throw Error('Unknown module class: ' + $module.constructor.name);
}

function checkReportModule($module) {
  var context = new Map();
  $module.parameters.forEach(function(parameter) {
    var $type = checkType(parameter.type);
    context.set(parameter.name, $type);
  });
  $module.body.forEach(function(statement) {
    checkStatement(context, statement);
  });
}

function checkStatement(context, statement) {
  if (statement instanceof ast.SQLTableStatement) {
    checkSQLTableStatement(context, statement);
    return;
  }
  if (statement instanceof ast.WriteStatement) {
    checkWriteStatement(context, statement);
    return;
  }
  throw Error('Unknown statement class: ' + statement.constructor.name);
}

function checkSQLTableStatement(context, statement) {
  statement.arguments.forEach(function(argument) {
    checkExpression(context, argument);
  });
}

function checkWriteStatement(context, statement) {
  var textType = checkExpression(context, statement.text);
  if (textType !== type.TextType.instance) {
    throw Error('Argument to WRITE statement is not of type TEXT.');
  }
}

function checkExpression(context, expression) {
  if (expression instanceof ast.NamedExpression) {
    return checkNamedExpression(context, expression);
  }
  if (expression instanceof ast.TextExpression) {
    return checkTextExpression(expression);
  }
  throw Error('Unknown expression class: ' + expression.constructor.name);
}

function checkNamedExpression(context, expression) {
  if (!context.has(expression.name)) {
    throw Error('The name ' + expression.name + ' is unknown.');
  }
  return context.get(expression.name);
}

function checkTextExpression(expression) {
  return type.TextType.instance;
}

function checkType($type) {
  if ($type instanceof ast.NamedType) {
    return checkNamedType($type);
  }
  throw Error('Unknown type class: ' + $type.constructor.name);
}

function checkNamedType($type) {
  switch ($type.name) {
    case 'TEXT': return type.TextType.instance;
    default: throw Error('The name ' + type.name + ' is unknown.');
  }
}

module.exports = {
  checkModule: checkModule,
  checkReportModule: checkReportModule,

  checkStatement: checkStatement,
  checkWriteStatement: checkWriteStatement,

  checkExpression: checkExpression,
  checkTextExpression: checkTextExpression,
};
