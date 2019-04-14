triggers
  = predicate (whitespace operator whitespace predicate)*

predicate
  = lvalue:operand whitespace? op:operator whitespace? rvalue:operand {
      console.log(lvalue);
      console.log(rvalue);
      return {
          type: "PREDICATE",
          lvalue: lvalue,
          op: op,
          rvalue: rvalue
      }
  }

operand
  = trigger:evaluated_expression
  / constant:const_expr

evaluated_expression
  = open_brace expression close_brace

expression
  = trigger_expr
  / user_macro
  / lld_macro
  / builtin_macro

trigger_expr
  = server:server? item
  / item

server
  = name:[a-zA-Z0-9-\.]+ ":" { return name.join("") }

item
  = name:key_string iargs:item_parameters? period? fname:key_element? fargs:function_parameters? {
    return {
      key: name,
      keyArgs: iargs,
      func: fname,
      funcArgs: fargs,
    };
  }


key_string
  = key_fragment*

key_fragment
  = key_element period?
// https://www.zabbix.com/documentation/4.0/manual/config/items/item/key

key_element
  = s:[0-9a-zA-Z_-]+ { return s.join("") }

period
  = "."

item_parameters
  = open_bracket parameter* close_bracket

open_bracket
  = "["

close_bracket
  = "]"

function_parameters
  = open_paren args:parameter* close_paren {
    return args;
  }

open_paren
  = "("

close_paren
  = ")"

// TODO: array of sub parameters
parameter
  = val:string ","?

// TODO: escaping via \"
quoted_string
  = '"' [^"]+ '"'

string
  = unquoted_string 
  / quoted_string

unquoted_string
  = chars:[a-zA-Z0-9/]+ {
      return chars.join("");
  }



function
  = name:[a-zA-Z0-9]+ args:function_parameters? {
    //   const loc = location();
    //   console.log(loc);

      return { 
          type: 'FUNCTION',
          name: name.join(""),
          args: args
      }
  }

regex_macro
  = "@" name:[a-zA-Z]+ {
      return {
          type: "MACRO",
          macro_type: "REGEX",
          name: name
      }
  }

user_macro
  = "$" [A-Z.]+ {
      return {
          type: "MACRO",
          macro_type: "USER",
          name: text()
      }
  }

builtin_macro
  = [A-Z.]+ {
      return {
          type: "MACRO",
          macro_type: "BUILTIN",
          name: text()
      }
  }

lld_macro
  = "#" [A-Z.]+ {
      return {
          type: "MACRO",
          macro_type: "LLD",
          name: text()
      }
  }

operator
  = '-' / 'not' / '*' / '/' / '+' / '-' / '<' / '<=' /
    '>' / '>=' / '=' / '<>' / 'and' / 'or'

comparison_operator
  = '<' / '<=' / '>' / '>=' / '=' / '<>'

logical_operator
  = 'and' / 'or' / 'not'

open_brace
  = "{"

close_brace
  = "}"

const_expr
  = v:byte_expr
  / time_expr
  / number

byte_expr
  = value:number byte_unit:byte_unit

byte_unit
  = "K"
  / "M"
  / "G"
  / "T"

time_expr
  = value:number time_unit:time_unit

time_unit
  = "s"
  / "m"
  / "h"
  / "d"
  / "w"

// ----- 6. Numbers ----- stolen from json example

number "number"
  = minus? int frac? { return parseFloat(text()); }

decimal_point
  = "."

digit1_9
  = [1-9]

frac
  = decimal_point DIGIT+

int
  = zero / (digit1_9 DIGIT*)

minus
  = "-"

plus
  = "+"

zero
  = "0"

whitespace
  = [ \t\r\n\f]+

// ----- Core ABNF Rules -----

// See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4234).
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i
