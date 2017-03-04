%{
var ast = require('./ast');
%}

%lex

%%

\s+      ;

\".*?\" { return 'TEXT'; }

"END"    { return 'END'; }
"REPORT" { return 'REPORT'; }
"WRITE"  { return 'WRITE'; }

[A-Za-z][A-Za-z0-9]* { return 'IDENTIFIER'; }

<<EOF>> { return 'EOF'; }

/lex

%start module

%%

module
  : report_module { return $1; }
  ;

report_module
  : REPORT IDENTIFIER statement_list END REPORT EOF
      { $$ = new ast.ReportModule($2, $3); }
  ;

statement_list
  :                          { $$ = []; }
  | statement statement_list { $$ = [$1].concat($2); }
  ;

statement
  : write_statement
  ;

write_statement
  : WRITE expression { $$ = new ast.WriteStatement($2); }
  ;

expression
  : text_expression
  ;

text_expression
  : TEXT { $$ = new ast.TextExpression($1); }
  ;
