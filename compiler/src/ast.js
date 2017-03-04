'use strict';

function ReportModule(name, parameters, body) {
  this.name = name;
  this.parameters = parameters;
  this.body = body;
}

function Parameter(name, type) {
  this.name = name;
  this.type = type;
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

var Level = {
  System: 0,
  Application: 1,
  Installation: 2,
};

module.exports = {
  ReportModule: ReportModule,

  Parameter: Parameter,

  WriteStatement: WriteStatement,

  NamedExpression: NamedExpression,
  TextExpression: TextExpression,

  NamedType: NamedType,

  Level: Level,
};
