%{
var ast = require('./ast');
%}

%lex

%%

\s+      ;

"," { return 'COMMA'; }

\"(.|\n)*?\" { yytext = yytext.slice(1, yytext.length - 1); return 'TEXT'; }

"ACTION"       { return 'ACTION'; }
"APPLICATION"  { return 'APPLICATION'; }
"ARGUMENTS"    { return 'ARGUMENTS'; }
"AUTOMATIC"    { return 'AUTOMATIC'; }
"END"          { return 'END'; }
"FORM"         { return 'FORM'; }
"INSTALLATION" { return 'INSTALLATION'; }
"PARAMETER"    { return 'PARAMETER'; }
"REPORT"       { return 'REPORT'; }
"SET"          { return 'SET'; }
"SQL"          { return 'SQL'; }
"SYSTEM"       { return 'SYSTEM'; }
"TABLE"        { return 'TABLE'; }
"TITLE"        { return 'TITLE'; }
"TYPE"         { return 'TYPE'; }
"WRITE"        { return 'WRITE'; }

[A-Za-z][A-Za-z0-9]* { return 'IDENTIFIER'; }

<<EOF>> { return 'EOF'; }

/lex

%start start

%%

start
  : module_list EOF { return $1; }
  ;

module_list
  :                    { $$ = []; }
  | module module_list { $$ = [$1].concat($2); }
  ;

module
  : action_module
  | report_module
  ;

action_module
  : ACTION IDENTIFIER parameter_list statement_list END ACTION
      { $$ = new ast.ActionModule($2, $3, $4); }
  ;

report_module
  : REPORT IDENTIFIER parameter_list statement_list END REPORT
      { $$ = new ast.ReportModule($2, $3, $4); }
  ;

module_reference
  : SYSTEM IDENTIFIER
      { $$ = new ast.ModuleReference(ast.Level.System, $2); }
  | APPLICATION IDENTIFIER
      { $$ = new ast.ModuleReference(ast.Level.Application, $2); }
  | INSTALLATION IDENTIFIER
      { $$ = new ast.ModuleReference(ast.Level.Installation, $2); }
  ;

parameter_list
  :
      { $$ = [] }
  | PARAMETER IDENTIFIER TYPE type parameter_list
      { $$ = [new ast.Parameter($2, $4)].concat($5); }
  ;

statement_list
  :                          { $$ = []; }
  | statement statement_list { $$ = [$1].concat($2); }
  ;

statement
  : form_statement
  | set_title_statement
  | sql_table_statement
  | write_statement
  ;

form_statement
  : FORM AUTOMATIC module_reference
      { $$ = new ast.FormAutomaticStatement($3); }
  ;

set_title_statement
  : SET TITLE expression { $$ = new ast.SetTitleStatement($3); }
  ;

sql_table_statement
  : SQL TABLE TEXT
      { $$ = new ast.SQLTableStatement($3, []); }
  | SQL TABLE TEXT ARGUMENTS expression_list
      { $$ = new ast.SQLTableStatement($3, $5); }
  ;

write_statement
  : WRITE expression { $$ = new ast.WriteStatement($2); }
  ;

expression_list
  : expression { $$ = [$1]; }
  | expression COMMA expression_list { $$ = [$1].concat($3); }
  ;

expression
  : named_expression
  | text_expression
  ;

named_expression
  : IDENTIFIER { $$ = new ast.NamedExpression($1); }
  ;

text_expression
  : TEXT { $$ = new ast.TextExpression($1); }
  ;

type
  : named_type
  ;

named_type
  : IDENTIFIER { $$ = new ast.NamedType($1); }
  ;
