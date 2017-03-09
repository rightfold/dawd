type expression =
  | Variable_expression of string
  | String_expression of string
  | Function_expression of string list * statement list
  | New_expression of string * expression list
  | Method_call_expression of expression * string * expression list
  | Assignment_expression of string * expression

and statement =
  | Use_statement of string
  | Expression_statement of expression
  | Return_statement of expression option

type program =
  statement list

let rec pretty_expression = function
  | Variable_expression (name) ->
      "$" ^ name
  | String_expression (value) ->
      "'" ^ value ^ "'"
  | Function_expression (parameters, body) ->
      "function(" ^
      String.concat ", " (List.map ((^) "$") parameters) ^
      ") {\n" ^
      String.concat "" (List.map pretty_statement body)^
      "}"
  | New_expression (class_, arguments) ->
      "new " ^ class_ ^ "(" ^
      String.concat ", " (List.map pretty_expression arguments) ^
      ")"
  | Method_call_expression (object_, method_, arguments) ->
      "(" ^ pretty_expression object_ ^ ")->" ^ method_ ^ "(" ^
      String.concat ", " (List.map pretty_expression arguments) ^
      ")"
  | Assignment_expression (variable, value) ->
      "$" ^ variable ^ " = " ^ pretty_expression value;

and pretty_statement = function
  | Use_statement (name) ->
      "use " ^ name ^ ";\n"
  | Expression_statement (expression) ->
      pretty_expression expression ^ ";\n"
  | Return_statement (None) ->
      "return;\n"
  | Return_statement (Some (value)) ->
      "return " ^ pretty_expression value ^ ";\n"

let pretty_program program =
    "<?php\n" ^ String.concat "" (List.map pretty_statement program)
