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
  = trigger:trigger_expr
  / constant:const_expr

trigger_expr
  = "{" server:server? item "}"
  / "{" item "}"

server
  = name:[^:]+ ":" { return name.join("") }

key
  = key_name:key_string i_args:item_parameters? f_args:function_parameters? {
      console.log(i_args);
      
      return {
          name: key_name,
          i_args: i_args,
          f_args: f_args
      }
  }


item
  = key:key "."? func:function?


key_string
  = name:[0-9a-zA-Z_.-]+ { return name.join("") }
// https://www.zabbix.com/documentation/4.0/manual/config/items/item/key

item_parameters
  = "[" parameter * "]"

function_parameters
  = "(" parameter * ")"

// TODO: array of sub parameters
parameter
  = val:string ","?

// TODO: escaping via \"
quoted_string
  = '"' [^"]+ '"'

string
  = unquoted_string 
  / quoted_string
  / macro

unquoted_string
  = chars:[a-zA-Z0-9/]+ {
      return chars.join("");
  }

operator
  = '-' / 'not' / '*' / '/' / '+' / '-' / '<' / '<=' /
    '>' / '>=' / '=' / '<>' / 'and' / 'or'


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

macro
  = user_macro
  / builtin_macro
  / lld_macro

regex_macro
  = "@" name:[a-zA-Z]+ {
      return {
          type: "MACRO",
          macro_type: "REGEX",
          name: name
      }
  }

user_macro
  = "{" "$" name:[A-Z.]+ "}" {
      return {
          type: "MACRO",
          macro_type: "USER",
          name: name
      }
  }

builtin_macro
  = "{" name:[A-Z.]+ "}" {
      return {
          type: "MACRO",
          macro_type: "BUILTIN",
          name: name
      }
  }

lld_macro
  = "{" "#" name:[A-Z.]+ "}" {
      return {
          type: "MACRO",
          macro_type: "LLD",
          name: name
      }
  }

const_expr
  = v:byte_expr
  / time_expr
  / num

byte_expr
  = value:num unit:"K" { return { type: "BYTES", unit: unit, value: value }}
  / value:num unit:"M" { return { type: "BYTES", unit: unit, value: value }}
  / value:num unit:"G" { return { type: "BYTES", unit: unit, value: value }}
  / value:num unit:"T" { return { type: "BYTES", unit: unit, value: value }}

time_expr
  = value:num unit:"s"
  / value:num unit:"m"
  / value:num unit:"h"
  / value:num unit:"d"
  / value:num unit:"w" {
    return {
        type: "TIME",
        value: value,
        unit: unit,
        seconds: 0
    }
  }

num
  = [+-]? ([0-9]* "." [0-9]+ / [0-9]+) ("e" [+-]? [0-9]+)? {
      return parseFloat(text());
    }

whitespace
  = [ \t\r\n\f]+