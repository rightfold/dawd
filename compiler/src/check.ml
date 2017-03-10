open Ast
open Type

exception Type_error

let check_expression = function
  | String_expression _ -> String_type

let check_statement = function
  | Write_statement value ->
      begin
        match check_expression value with
        | String_type -> ()
      end

let check_program = function
  | Report_program (_, body) ->
      List.iter check_statement body
