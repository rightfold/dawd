open Ast

let codegen_expression = function
  | String_expression value -> Php.String_expression value

let codegen_statement = function
  | Write_statement value ->
      let open Php in
      let append_arguments = [String_expression "default"; codegen_expression value] in
      let append_call = Method_call_expression (Variable_expression "document", "append", append_arguments) in
      [Expression_statement append_call]

let codegen_program = function
  | Report_program (_, body) ->
      let open Php in
      let render_setup = [Expression_statement (Assignment_expression ("document", New_expression ("Document", [])))] in
      let render_body = List.flatten (List.map codegen_statement body) in
      let render_teardown = [Return_statement (Some (Variable_expression "document"))] in
      let render = Function_expression ([], render_setup @ render_body @ render_teardown) in
      let report = New_expression ("Report", [render]) in
      [ Use_statement "DAWD\\Document"
      ; Use_statement "DAWD\\Program\\Report"
      ; Return_statement (Some report)
      ]
