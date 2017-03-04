function ReportModule(name, body) {
  this.name = name;
  this.body = body;
}

function WriteStatement(text) {
  this.text = text;
}

function TextExpression(text) {
  this.text = text;
}

var Level = {
  System: 0,
  Application: 1,
  Installation: 2,
};

module.exports = {
  ReportModule: ReportModule,

  WriteStatement: WriteStatement,

  TextExpression: TextExpression,

  Level: Level,
};
