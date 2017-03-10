%token <string> IDENTIFIER

%token <string> STRING

%token END
%token REPORT
%token WRITE

%token EOF

%start <Ast.program> program

%%

program:
  | p = report_program EOF { p }
  ;

report_program:
  | REPORT name = IDENTIFIER body = list(statement) END REPORT
      { Ast.Report_program (name, body) }
  ;

statement:
  | s = write_statement { s }
  ;

write_statement:
  | WRITE value = expression { Ast.Write_statement value }
  ;

expression:
  | e = string_expression { e }
  ;

string_expression:
  | value = STRING { Ast.String_expression value }
  ;
