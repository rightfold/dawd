var ast = require('./ast');
var type = require('./type');

function checkModule($module) {
  if ($module instanceof ast.ReportModule) {
    return checkReportModule($module);
  }
  throw Error('Unknown module class: ' + $module.constructor.name);
}

function checkReportModule($module) {
  $module.body.forEach(function(statement) {
    checkStatement(statement);
  });
}

function checkStatement(statement) {
  if (statement instanceof ast.WriteStatement) {
    checkWriteStatement(statement);
    return;
  }
  throw Error('Unknown statement class: ' + statement.constructor.name);
}

function checkWriteStatement(statement) {
  var textType = checkExpression(statement.text);
  if (textType !== type.TextType.instance) {
    throw Error('Argument to WRITE statement is not of type TEXT.');
  }
}

function checkExpression(expression) {
  if (expression instanceof ast.TextExpression) {
    return checkTextExpression(expression);
  }
  throw Error('Unknown expression class: ' + expression.constructor.name);
}

function checkTextExpression(expression) {
  return type.TextType.instance;
}

module.exports = {
  checkModule: checkModule,
  checkReportModule: checkReportModule,

  checkStatement: checkStatement,
  checkWriteStatement: checkWriteStatement,

  checkExpression: checkExpression,
  checkTextExpression: checkTextExpression,
};
