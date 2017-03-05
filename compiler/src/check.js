'use strict';

var ast = require('./ast');
var type = require('./type');

function Context() {
  this.modules = new Map();
  this.variables = new Map();
}

Context.prototype.derive = function() {
  var context = new Context();
  context.modules = new Map(this.modules.entries());
  context.variables = new Map(this.variables.entries());
  return context;
};

function Module(type, parameterTypes) {
  this.type = type;
  this.parameterTypes = parameterTypes;
}

function checkModule(context, $module) {
  if ($module instanceof ast.ActionModule) {
    return checkActionModule(context, $module);
  }
  if ($module instanceof ast.ReportModule) {
    return checkReportModule(context, $module);
  }
  throw Error('Unknown module class: ' + $module.constructor.name);
}

var checkActionModule = checkActionOrReportModule;

var checkReportModule = checkActionOrReportModule;

function checkActionOrReportModule(context, $module) {
  var moduleType;
  if ($module instanceof ast.ActionModule) {
    moduleType = ast.ModuleType.Action;
  } else if ($module instanceof ast.ReportModule) {
    moduleType = ast.ModuleType.Report;
  } else {
    throw Error('Unknown module class: ' + $module.constructor.name);
  }

  var moduleEntry = new Module(moduleType, new Map());
  context.modules.set($module.name, moduleEntry);

  var localContext = context.derive();

  $module.parameters.forEach(function(parameter) {
    var $type = checkType(parameter.type);
    moduleEntry.parameterTypes.set(parameter.name, $type);
    localContext.variables.set(parameter.name, $type);
  });

  $module.body.forEach(function(statement) {
    checkStatement(localContext, statement);
  });
}

function checkStatement(context, statement) {
  if (statement instanceof ast.FormAutomaticStatement) {
    checkFormAutomaticStatement(context, statement);
    return;
  }
  if (statement instanceof ast.SetTitleStatement) {
    checkSetTitleStatement(context, statement);
    return;
  }
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

function checkFormAutomaticStatement(context, statement) {
  var moduleName = statement.module.name;
  if (!context.modules.has(moduleName)) {
    throw Error('The module ' + moduleName + ' is unknown.');
  }
  var $module = context.modules.get(moduleName);
  statement.moduleType = $module.type;
  statement.moduleParameters = $module.parameterTypes;
}

function checkSetTitleStatement(context, statement) {
  var textType = checkExpression(context, statement.text);
  if (textType !== type.TextType.instance) {
    throw Error('Argument to SET TITLE statement is not of type TEXT.');
  }
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
  if (!context.variables.has(expression.name)) {
    throw Error('The name ' + expression.name + ' is unknown.');
  }
  return context.variables.get(expression.name);
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
  Context: Context,

  checkModule: checkModule,
  checkActionModule: checkActionModule,
  checkReportModule: checkReportModule,

  checkStatement: checkStatement,
  checkWriteStatement: checkWriteStatement,

  checkExpression: checkExpression,
  checkTextExpression: checkTextExpression,
};
