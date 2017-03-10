{
open Parse
}

let white = [' ' '\t' '\r' '\n']+

rule read =
  parse
  | white { read lexbuf }

  | "END"    { END }
  | "REPORT" { REPORT }
  | "WRITE"  { WRITE }

  | ['a'-'z' 'A'-'Z' '_']+ { IDENTIFIER (Lexing.lexeme lexbuf) }

  | '"'[^'"']*'"'
      {
        let raw = Lexing.lexeme lexbuf in
        STRING (String.sub raw 1 (String.length raw - 2))
      }

  | eof { EOF }
