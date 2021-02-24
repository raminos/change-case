# Change Case Cli

This is a small cli tool used to change the case of a given string

## Installation

You need to have Deno installed to use this tool. If you haven't check out its [installation guide](https://deno.land/manual/getting_started/installation).

```sh
deno install https://raw.githubusercontent.com/raminos/change-case/master/change-case.ts

# If you haven't done it yet add deno to your path like this

echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.zshrc

```

## Usage

Supports snake, kebab, flat, camel, pascal, scraming snake and screaming
kebab case. All non alphanumeric symbols will be filtered out.

```sh

$ change-case -c "Hello World"
helloWorld

$ change-case --camel "Hello World"
helloWorld

$ change-case -f "Hello World"
helloworld

$ change-case --flat "Hello World"
helloworld

$ change-case -k "Hello World"
hello-world

$ change-case --kebab "Hello World"
hello-world

$ change-case -p "Hello World"
HelloWorld

$ change-case --pascal "Hello World"
HelloWorld

$ change-case -s "Hello World"
hello_world

$ change-case --snake "Hello World"
hello_world

$ change-case -sk "Hello World"
HELLO-WORLD

$ change-case --screaming-kebab "Hello World"
HELLO-WORLD

$ change-case -ss "Hello World"
HELLO_WORLD

$ change-case --screaming-snake "Hello World"
HELLO_WORLD

# Supports using a cased string as an input

$ change-case --snake "hello_world"
hello_world

$ change-case --snake "hello-world"
hello_world

$ change-case --snake "helloWorld"
hello_world

$ change-case --snake "HelloWorld"
hello_world

$ change-case --snake "HELLO-WORLD"
hello_world

$ change-case --snake "HELLO_WORLD"
hello_world

# Supports pipes

$ echo "Hello World" | change-case --snake
hello_world

```
