# Change Case Cli

This is a small cli tool used to change the case of a given string

## Installation
You need to have Deno installed to use this tool. If you haven't check out its [installation guide](https://deno.land/manual/getting_started/installation)

```sh
deno install -n change-case https://github.com/raminos/change-case/blob/master/main.ts

# If you haven't done it yet add deno to your path like this

echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.zshrc

```

## Usage
Supports snake, kebab, flat, camel and pascal case.

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

```
