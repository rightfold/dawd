open Ast
open Type

exception Type_error

val check_expression : expression -> type_
val check_statement : statement -> unit
val check_program : program -> unit
