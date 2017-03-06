'use strict';

var ast = require('./ast');
var type = require('./type');

function checkErrStatement() {
  return {
    type: 'IfStatement',
    test: {
      type: 'BinaryExpression',
      left: {
        type: 'IdentifierExpression',
        name: 'err',
      },
      operator: '!==',
      right: {
        type: 'LiteralNullExpression',
      },
    },
    consequent: {
      type: 'BlockStatement',
      block: {
        type: 'Block',
        statements: [
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
                  type: 'IdentifierExpression',
                  name: 'err',
                },
              ],
            },
          },
          {
            type: 'ReturnStatement',
            expression: null,
          },
        ],
      },
    },
    alternate: null,
  };
}

function codegenModule($module, level) {
  if ($module instanceof ast.ActionModule) {
    return codegenActionModule($module, level);
  }
  if ($module instanceof ast.ReportModule) {
    return codegenReportModule($module, level);
  }
  throw Error('Unknown module class: ' + $module.constructor.name);
}

var codegenActionModule = codegenActionOrReportModule;

var codegenReportModule = codegenActionOrReportModule;

function codegenActionOrReportModule($module, level) {
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
                      property: (function() {
                        if ($module instanceof ast.ActionModule) {
                          return 'ActionModule';
                        }
                        if ($module instanceof ast.ReportModule) {
                          return 'ReportModule';
                        }
                      })(),
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
                              name: 'dbPool',
                            },
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
  if (statement instanceof ast.ExecuteSQLStatement) {
    return codegenExecuteSQLStatement(statement, next);
  }
  if (statement instanceof ast.FormAutomaticStatement) {
    return codegenFormAutomaticStatement(statement, next);
  }
  if (statement instanceof ast.SetTitleStatement) {
    return codegenSetTitleStatement(statement, next);
  }
  if (statement instanceof ast.SQLTableStatement) {
    return codegenSQLTableStatement(statement, next);
  }
  if (statement instanceof ast.WriteStatement) {
    return codegenWriteStatement(statement, next);
  }
  throw Error('Unknown statement class: ' + statement.constructor.name);
}

function codegenExecuteSQLStatement(statement, next) {
  return [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'StaticMemberExpression',
          object: {
            type: 'IdentifierExpression',
            name: 'dbPool',
          },
          property: 'connect',
        },
        arguments: [
          {
            type: 'FunctionExpression',
            isGenerator: false,
            name: null,
            params: {
              type: 'FormalParameters',
              items: [
                {
                  type: 'BindingIdentifier',
                  name: 'err',
                },
                {
                  type: 'BindingIdentifier',
                  name: 'client',
                },
                {
                  type: 'BindingIdentifier',
                  name: 'done',
                },
              ],
            },
            body: {
              type: 'FunctionBody',
              directives: [],
              statements: [
                checkErrStatement(),
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: {
                      type: 'StaticMemberExpression',
                      object: {
                        type: 'IdentifierExpression',
                        name: 'client',
                      },
                      property: 'query',
                    },
                    arguments: [
                      {
                        type: 'LiteralStringExpression',
                        value: statement.query,
                      },
                      {
                        type: 'ArrayExpression',
                        elements: statement.arguments.map(function(argument) {
                          return codegenExpression(argument);
                        }),
                      },
                      {
                        type: 'FunctionExpression',
                        isGenerator: false,
                        name: null,
                        params: {
                          type: 'FormalParameters',
                          items: [
                            {
                              type: 'BindingIdentifier',
                              name: 'err',
                            },
                            {
                              type: 'BindingIdentifier',
                              name: 'result',
                            },
                          ],
                        },
                        body: {
                          type: 'FunctionBody',
                          directives: [],
                          statements: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'CallExpression',
                                callee: {
                                  type: 'IdentifierExpression',
                                  name: 'done',
                                },
                                arguments: [
                                  {
                                    type: 'IdentifierExpression',
                                    name: 'err',
                                  },
                                ],
                              },
                            },
                            checkErrStatement(),
                          ].concat(next),
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ];
}

function codegenFormAutomaticStatement(statement, next) {
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
          property: 'formAutomatic',
        },
        arguments: [
          {
            type: 'LiteralNumericExpression',
            value: statement.moduleType,
          },
          {
            type: 'LiteralNumericExpression',
            value: statement.module.level,
          },
          {
            type: 'LiteralStringExpression',
            value: statement.module.name,
          },
          {
            type: 'ArrayExpression',
            elements: Array.from(statement.moduleParameters.keys()).map(function(parameter) {
              return {
                type: 'LiteralStringExpression',
                value: parameter,
              };
            }),
          },
        ],
      },
    },
  ].concat(next);
}

function codegenSetTitleStatement(statement, next) {
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
          property: 'setTitle',
        },
        arguments: [
          text,
        ],
      },
    },
  ].concat(next);
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
            type: 'IdentifierExpression',
            name: 'dbPool',
          },
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
  codegenActionModule: codegenActionModule,
  codegenReportModule: codegenReportModule,

  codegenStatement: codegenStatement,
  codegenSQLTableStatement: codegenSQLTableStatement,
  codegenWriteStatement: codegenWriteStatement,

  codegenExpression: codegenExpression,
  codegenTextExpression: codegenTextExpression,
};
