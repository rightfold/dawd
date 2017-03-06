'use strict';

function ActionModule(name, parameters, body) {
  this.name = name;
  this.parameters = parameters;
  this.body = body;
}

function ReportModule(name, parameters, body) {
  this.name = name;
  this.parameters = parameters;
  this.body = body;
}

function ModuleReference(level, name) {
  this.level = level;
  this.name = name;
}

function Parameter(name, type) {
  this.name = name;
  this.type = type;
}

function ExecuteSQLStatement(query, $arguments) {
  this.query = query;
  this.arguments = $arguments;
}

function FormAutomaticStatement($module) {
  this.module = $module;

  this.moduleType = null;
  this.moduleParameters = null;
}

function SetTitleStatement(text) {
  this.text = text;
}

function SQLTableStatement(query, $arguments) {
  this.query = query;
  this.arguments = $arguments;
}

function WriteStatement(text) {
  this.text = text;
}

function NamedExpression(name) {
  this.name = name;
}

function TextExpression(text) {
  this.text = text;
}

function NamedType(name) {
  this.name = name;
}

var ModuleType = {
  Action: 0,
  Report: 1,
};

var Level = {
  System: 0,
  Application: 1,
  Installation: 2,
};

module.exports = {
  ActionModule: ActionModule,
  ReportModule: ReportModule,

  ModuleReference: ModuleReference,

  Parameter: Parameter,

  ExecuteSQLStatement: ExecuteSQLStatement,
  FormAutomaticStatement: FormAutomaticStatement,
  SetTitleStatement: SetTitleStatement,
  SQLTableStatement: SQLTableStatement,
  WriteStatement: WriteStatement,

  NamedExpression: NamedExpression,
  TextExpression: TextExpression,

  NamedType: NamedType,

  ModuleType: ModuleType,

  Level: Level,
};
