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

module.exports = {
  ReportModule: ReportModule,

  WriteStatement: WriteStatement,

  TextExpression: TextExpression,
};
