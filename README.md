# Universal Hello World Compiler

UHWC is able to analyze *any* Hello World program and compile it for a multitude of targets.

## Features

- [x] Blazingly fast compilation speed.
- [x] Blazingly fast executable speed.
- [x] Memory safety guarueantead.
- [x] Supports many compilation targets.
- [x] Rust.

## Examples

### JavaScript/TypeScript

```js
console.log("Hello, world!");
```

```bash
Hello, world!
```

### New Languages

It even works with new languages!

For example, here's a concept language I made just now.

```dslhn
vdfjnskahfljdskahfdjklsahfjds
```

```bash
Hello, world!
```

It correctly compiles even though the compiler has never seen it before!

### Bug Correction

UHWC is also able to detect and correct bugs for you!

Here's an example of this in Rust.

```rust
/// Copyright (c) 2016 Florent Fayolle
/// 
/// Permission is hereby granted, free of charge, to any person obtaining
/// a copy of this software and associated documentation files (the
/// "Software"), to deal in the Software without restriction, including
/// without limitation the rights to use, copy, modify, merge, publish,
/// distribute, sublicense, and/or sell copies of the Software, and to
/// permit persons to whom the Software is furnished to do so, subject to
/// the following conditions:
/// 
/// The above copyright notice and this permission notice shall be
/// included in all copies or substantial portions of the Software.
/// 
/// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
/// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
/// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
/// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
/// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
/// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
/// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

use std::io::{self, Write};

enum Operator {
  Addition,
  Substraction,
  Multiplication,
  Division,
  Modulo
}

enum OperationElt {
  Operator(Operator),
  Operand(f32)
}

fn tokenizer(expr: &str) -> Result<Vec<OperationElt>, String> {
  expr.split_whitespace()
    .map(|el| {
      match el {
        "+" => Ok(OperationElt::Operator(Operator::Addition)),
        "-" => Ok(OperationElt::Operator(Operator::Substraction)),
        "*" => Ok(OperationElt::Operator(Operator::Multiplication)),
        "/" => Ok(OperationElt::Operator(Operator::Division)),
        "%" => Ok(OperationElt::Operator(Operator::Modulo)),
        operand => match operand.parse::<f32>() {
          Ok(val) => Ok(OperationElt::Operand(val)),
          Err(_) => Err(format!("Cannot parse operand \"{}\"", operand))
        }
      }
    })
    .into_iter()
    .collect()
}

/// Evaluates an RPL expression.
///
/// # Examples
/// ````
/// extern crate rpn;
///
/// let result:f32 = rpn::evaluate("5 2 +").unwrap();
/// assert_eq!(result, 7.0);
/// ````
///
/// # Errors
/// This function will return an error in case of bad expression:
///
/// - if it includes an unrecognized operator (recognized ones are +, -, * and /
/// - if it misses an operand (i.e. value)
/// - if it misses an operator
pub fn evaluate(expr: &str) -> Result<f32, String> {
  return match tokenizer(expr) {
    Ok(tokens) => {
      let mut stack:Vec<f32> = Vec::new();
      for token in tokens {
        match token {
          OperationElt::Operator(operator) => {
            if stack.len() < 2 {
              return Err("Unsufficient operands before operator".to_string());
            }
            let operand2 = stack.pop().expect("expected f32 values in stack");
            let operand1 = stack.pop().expect("expected f32 values in stack");
            let result = match operator {
              Operator::Addition        => operand1 + operand2,
              Operator::Substraction    => operand1 - operand2,
              Operator::Multiplication  => operand1 * operand2,
              Operator::Division        => operand1 / operand2,
              Operator::Modulo          => operand1 % operand2
            };
            stack.push(result);
          },
          OperationElt::Operand(val) => stack.push(val)
        }
      }
      if stack.len() != 1 {
        return Err("Remaining untreated operands. Probably missing operator.".to_string());
      }
      return Ok(stack.pop().expect("expected a f32 value remaining in stack"));
    },
    Err(err) => Err(err)
  }
}

#[test]
fn it_adds() {
  let result = evaluate("1 2 +");
  assert_eq!(result.unwrap(), 3.0);
}

#[test]
fn it_substracts() {
  let result = evaluate("1 2 -");
  assert_eq!(result.unwrap(), -1.0);
}

#[test]
fn it_multiplies() {
  let result = evaluate("6 7 *");
  assert_eq!(result.unwrap(), 42.0);
}

#[test]
fn it_divides() {
  let result = evaluate("1 2 /");
  assert_eq!(result.unwrap(), 0.5);
}

#[test]
fn it_modulos() {
  let result = evaluate("4 2 %");
  assert_eq!(result.unwrap(), 0.0);
}

#[test]
fn it_evaluates_complex_expressions() {
  // ((1+2) * 8 / (5-1) - 4 % 3) / 2
  let result = evaluate("1 2 + 8 * 5 1 - / 4 3 % - 2 /");
  assert_eq!(result.unwrap(), 2.5);
}

#[test]
fn it_allows_multiple_shitespaces() {
  let result = evaluate("1  2 +\t3 -");
  assert_eq!(result.unwrap(), 0.0);
}

#[test]
fn it_fails_for_unsupported_characters() {
  let result = evaluate("1 2 t");
  assert_eq!(result.unwrap_err(), "Cannot parse operand \"t\"");
}

#[test]
fn it_fails_for_unsufficient_operands() {
  let result = evaluate("1 +");
  assert_eq!(result.unwrap_err(), "Unsufficient operands before operator");
}

#[test]
fn it_fails_for_unsufficient_operators() {
  let result = evaluate("1 2 3 +");
  assert_eq!(result.unwrap_err(),
    "Remaining untreated operands. Probably missing operator.");
}

fn main() {
  println!("Reverse Polish Notation.");
  println!("Type quit to exit");

  loop {
    print!("> ");
    io::stdout().flush().expect("flushing failed");
    let mut input = String::new();

    io::stdin().read_line(&mut input)
      .expect("failed to read line");

    if input.trim() == "quit" {
      break;
    }
    let result = evaluate(&input);
    match result {
      Err(err) => println!("Error: {}", err),
      Ok(res) => println!("{}", res)
    }
  }
}
```

As you can see this program has a syntax error, but UHWC automatically corrects it and compiles!

```bash
Hello, world!
```
