type expression =
  | String_expression of string

type statement =
  | Write_statement of expression

type program =
  | Report_program of string * statement list

let pretty_expression = function
  | String_expression (value) ->
      "\"" ^ value ^ "\""

let pretty_statement = function
  | Write_statement (value) ->
      "WRITE " ^ pretty_expression value ^ "\n"

let pretty_program = function
  | Report_program (name, body) ->
      "REPORT " ^ name ^ "\n" ^
      String.concat "" (List.map pretty_statement body) ^
      "END REPORT\n"
