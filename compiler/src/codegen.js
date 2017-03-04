'use strict';

var ast = require('./ast');
var type = require('./type');

function codegenModule($module, level) {
  if ($module instanceof ast.ReportModule) {
    return codegenReportModule($module, level);
  }
  throw Error('Unknown module class: ' + $module.constructor.name);
}

function codegenReportModule($module, level) {
  return {
    type: 'Script',
    directives: [
      {
        type: 'Directive',
        rawValue: 'use strict',
      },
    ],
    statements: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          binding: {
            type: 'StaticMemberAssignmentTarget',
            object: {
              type: 'IdentifierExpression',
              name: 'module',
            },
            property: 'exports',
          },
          expression: {
            type: 'FunctionExpression',
            isGenerator: false,
            name: null,
            params: {
              type: 'FormalParameters',
              items: [
                {
                  type: 'BindingIdentifier',
                  name: '$module',
                }
              ],
              rest: null,
            },
            body: {
              type: 'FunctionBody',
              directives: [],
              statements: [
                {
                  type: 'ReturnStatement',
                  expression: {
                    type: 'NewExpression',
                    callee: {
                      type: 'StaticMemberExpression',
                      object: {
                        type: 'IdentifierExpression',
                        name: '$module',
                      },
                      property: 'ReportModule',
                    },
                    arguments: [
                      {
                        type: 'LiteralStringExpression',
                        value: $module.name,
                      },
                      {
                        type: 'StaticMemberExpression',
                        object: {
                          type: 'StaticMemberExpression',
                          object: {
                            type: 'IdentifierExpression',
                            name: '$module',
                          },
                          property: 'Level',
                        },
                        property: (function() {
                          switch (level) {
                            case ast.Level.System:       return 'System';
                            case ast.Level.Application:  return 'Application';
                            case ast.Level.Installation: return 'Installation';
                          }
                        })(),
                      },
                      {
                        type: 'FunctionExpression',
                        isGenerator: false,
                        name: null,
                        params: {
                          type: 'FormalParameters',
                          items: [,
                            {
                              type: 'BindingIdentifier',
                              name: '$arguments',
                            },
                            {
                              type: 'BindingIdentifier',
                              name: 'document',
                            },
                            {
                              type: 'BindingIdentifier',
                              name: 'callback',
                            },
                          ],
                        },
                        body: {
                          type: 'FunctionBody',
                          directives: [],
                          statements: $module.parameters.map(function(parameter) {
                            return {
                              type: 'VariableDeclarationStatement',
                              declaration: {
                                type: 'VariableDeclaration',
                                kind: 'var',
                                declarators: [
                                  {
                                    type: 'VariableDeclarator',
                                    binding: {
                                      type: 'BindingIdentifier',
                                      name: '$$' + parameter.name,
                                    },
                                    init: {
                                      type: 'StaticMemberExpression',
                                      object: {
                                        type: 'IdentifierExpression',
                                        name: '$arguments',
                                      },
                                      property: parameter.name,
                                    },
                                  }
                                ],
                              },
                            };
                          }).concat($module.body.reduceRight(function(next, statement) {
                            return codegenStatement(statement, next);
                          }, [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'CallExpression',
                                callee: {
                                  type: 'IdentifierExpression',
                                  name: 'callback',
                                },
                                arguments: [
                                  {
                                    type: 'LiteralNullExpression',
                                  },
                                ],
                              },
                            },
                          ])),
                        },
                      },
                    ],
                  },
                },
              ],
            }
          },
        },
      },
    ],
    items: [],
  };
}

function codegenStatement(statement, next) {
  if (statement instanceof ast.SQLTableStatement) {
    return codegenSQLTableStatement(statement, next);
  }
  if (statement instanceof ast.WriteStatement) {
    return codegenWriteStatement(statement, next);
  }
  throw Error('Unknown statement class: ' + statement.constructor.name);
}

function codegenSQLTableStatement(statement, next) {
  var $arguments = statement.arguments.map(function(argument) {
    return codegenExpression(argument);
  });
  return [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'StaticMemberExpression',
          object: {
            type: 'IdentifierExpression',
            name: 'document',
          },
          property: 'sqlTable',
        },
        arguments: [
          {
            type: 'LiteralStringExpression',
            value: statement.query,
          },
          {
            type: 'ArrayExpression',
            elements: $arguments,
          },
          {
            type: 'FunctionExpression',
            isGenerator: false,
            name: null,
            params: {
              type: 'FormalParameters',
              items: [],
            },
            body: {
              type: 'FunctionBody',
              directives: [],
              statements: next,
            },
          },
        ],
      },
    },
  ];
}

function codegenWriteStatement(statement, next) {
  var text = codegenExpression(statement.text);
  return [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'StaticMemberExpression',
          object: {
            type: 'IdentifierExpression',
            name: 'document',
          },
          property: 'write',
        },
        arguments: [
          text,
        ],
      },
    },
  ].concat(next);
}

function codegenExpression(expression) {
  if (expression instanceof ast.NamedExpression) {
    return codegenNamedExpression(expression);
  }
  if (expression instanceof ast.TextExpression) {
    return codegenTextExpression(expression);
  }
  throw Error('Unknown expression class: ' + expression.constructor.name);
}

function codegenNamedExpression(expression) {
  return {
    type: 'IdentifierExpression',
    name: '$$' + expression.name,
  };
}

function codegenTextExpression(expression) {
  return {
    type: 'LiteralStringExpression',
    value: expression.text,
  };
}

module.exports = {
  codegenModule: codegenModule,
  codegenReportModule: codegenReportModule,

  codegenStatement: codegenStatement,
  codegenSQLTableStatement: codegenSQLTableStatement,
  codegenWriteStatement: codegenWriteStatement,

  codegenExpression: codegenExpression,
  codegenTextExpression: codegenTextExpression,
};
