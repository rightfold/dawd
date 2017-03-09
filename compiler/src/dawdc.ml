let () =
  let open Ast in
  let open Check in
  let open Codegen in
  let ast = Report_program ("AHW", [Write_statement (String_expression ("Hello, world!"))]) in
  check_program ast;
  print_string (pretty_program ast);
  print_string (Php.pretty_program (codegen_program ast))
