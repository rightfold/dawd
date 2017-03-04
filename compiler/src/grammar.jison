%{
var ast = require('./ast');
%}

%lex

%%

\s+      ;

"," { return 'COMMA'; }

\".*?\" { yytext = yytext.slice(1, yytext.length - 1); return 'TEXT'; }

"ARGUMENTS" { return 'ARGUMENTS'; }
"END"       { return 'END'; }
"PARAMETER" { return 'PARAMETER'; }
"REPORT"    { return 'REPORT'; }
"SQL"       { return 'SQL'; }
"TABLE"     { return 'TABLE'; }
"TYPE"      { return 'TYPE'; }
"WRITE"     { return 'WRITE'; }

[A-Za-z][A-Za-z0-9]* { return 'IDENTIFIER'; }

<<EOF>> { return 'EOF'; }

/lex

%start module

%%

module
  : report_module { return $1; }
  ;

report_module
  : REPORT IDENTIFIER parameter_list statement_list END REPORT EOF
      { $$ = new ast.ReportModule($2, $3, $4); }
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
  : sql_table_statement
  | write_statement
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
