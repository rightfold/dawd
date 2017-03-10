let () =
  let open Check in
  let open Codegen in
  let lexbuf = Lexing.from_string "REPORT AHW\nWRITE \"Hello, world!\"\nEND REPORT\n" in
  let ast = Parse.program Lex.read lexbuf in
  check_program ast;
  print_string (Ast.pretty_program ast);
  print_string (Php.pretty_program (codegen_program ast))
