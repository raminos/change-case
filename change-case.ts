import { parse } from "https://deno.land/std/flags/mod.ts";
import { readLines } from "https://deno.land/std/io/bufio.ts";

const IS_CASELESS_REGEX = /^([a-z]+|[A-Z]+)$/g;
const isCaseless = (word: string): boolean => !!word.match(IS_CASELESS_REGEX);

function compose<R>(...fns: Array<(a: R) => R>) {
  return fns.reduce((prevFn, nextFn) => (value) => nextFn(prevFn(value)));
}

function splitInput(input: string): Array<string> {
  return input.split(/[ _-]/g);
}

function joinArraysOfLettersToWords(
  arraysOfLetters: Array<Array<string>>,
): Array<string> {
  return arraysOfLetters.reduce((wordArray, letterArray) => {
    wordArray.push(letterArray.join(""));
    return wordArray;
  }, []);
}

function splitWordWithCaseChange(word: string): Array<string> {
  let isWordBeginning = true;
  const lettersOfSplitUpWords: Array<Array<string>> = [[]];

  for (const letter of word) {
    if (letter.match(/[A-Z]/) && !isWordBeginning) {
      lettersOfSplitUpWords.push([letter]);
      isWordBeginning = true;
    } else {
      lettersOfSplitUpWords[lettersOfSplitUpWords.length - 1].push(letter);
      isWordBeginning = false;
    }
  }

  return joinArraysOfLettersToWords(lettersOfSplitUpWords);
}

function splitWordsWithCaseChange(words: Array<string>): Array<string> {
  if (words.every((word) => isCaseless(word))) return words;

  return words.reduce((newWords: Array<string>, word) => {
    const splittedWords = splitWordWithCaseChange(word);
    return newWords.concat(splittedWords);
  }, []);
}

function lowerCaseWords(words: Array<string>): Array<string> {
  return words.map((word) => word.toLowerCase());
}

function upperCaseWords(words: Array<string>): Array<string> {
  return words.map((word) => word.toUpperCase());
}

function capitalizeWords(words: Array<string>): Array<string> {
  return words
    .map((word) => {
      const [firstLetter, ...rest] = word;
      return `${firstLetter.toUpperCase()}${rest.join("")}`;
    });
}

function removeNonAlphaNumericChars(
  unfilteredWords: Array<string>,
): Array<string> {
  return unfilteredWords
    .map((word) => word.replace(/[^0-9a-z]/gi, ""))
    .filter(Boolean);
}

function createKebabCase(words: Array<string>): string {
  return words.join("-");
}

function createSnakeCase(words: Array<string>): string {
  return words.join("_");
}

function createFlatCase(words: Array<string>): string {
  return words.join("");
}

function createPascalCase(words: Array<string>): string {
  return upperCaseWords(words).join("");
}

function createCamelCase(words: Array<string>): string {
  const [first, ...rest] = words;
  return `${first}${capitalizeWords(rest).join("")}`;
}

function createScreamingKebabCase(words: Array<string>): string {
  return upperCaseWords(words).join("-");
}

function createScreamingSnakeCase(words: Array<string>): string {
  return upperCaseWords(words).join("_");
}

async function getPipeInput(): Promise<string> {
  let pipedInput = "";

  for await (const line of readLines(Deno.stdin)) {
    pipedInput += line;
  }

  return pipedInput;
}

async function main(args: Array<string>): Promise<void> {
  const {
    kebab,
    camel,
    snake,
    pascal,
    flat,
    "screaming-kebab": screamingKebab,
    "screaming-snake": screamingSnake,
    _: [argumentInput],
  } = parse(
    args,
    {
      alias: {
        "k": "kebab",
        "c": "camel",
        "s": "snake",
        "p": "pascal",
        "f": "flat",
        "K": "screaming-kebab",
        "S": "screaming-snake",
      },
      boolean: [
        "k",
        "c",
        "s",
        "p",
        "f",
        "K",
        "S",
      ],
      stopEarly: true,
    },
  );

  const input = argumentInput ? String(argumentInput) : await getPipeInput();
  const inputs = splitInput(input);
  const words = compose(
    removeNonAlphaNumericChars,
    splitWordsWithCaseChange,
    lowerCaseWords,
  )(inputs);

  if (kebab) console.log(createKebabCase(words));
  if (snake) console.log(createSnakeCase(words));
  if (flat) console.log(createFlatCase(words));
  if (camel) console.log(createCamelCase(words));
  if (pascal) console.log(createPascalCase(words));
  if (screamingKebab) console.log(createScreamingKebabCase(words));
  if (screamingSnake) console.log(createScreamingSnakeCase(words));
}

main(Deno.args);
