import { parse } from "https://deno.land/std/flags/mod.ts";
import { readLines } from "https://deno.land/std/io/bufio.ts";

const IS_CASELESS_REGEX = /^([a-z]+|[A-Z]+)$/g;
const isCaseless = (word: string): boolean => !!word.match(IS_CASELESS_REGEX);

const compose = <R>(...fns: Array<(a: R) => R>) => (
  fns.reduce((prevFn, nextFn) => (value) => nextFn(prevFn(value)))
);

const splitInput = (input: string): Array<string> => {
  return input.split(/[ _-]/g);
};

const joinArraysOfLettersToWords = (
  arraysOfLetters: Array<Array<string>>,
): Array<string> => (
  arraysOfLetters.reduce((wordArray, letterArray) => {
    wordArray.push(letterArray.join(""));
    return wordArray;
  }, [])
);

const splitWordWithCaseChange = (word: string): Array<string> => {
  let isWordBeginning = true;
  let splittedWordsLetters: Array<Array<string>> = [[]];

  for (const letter of word) {
    if (letter.match(/[A-Z]/) && !isWordBeginning) {
      splittedWordsLetters.push([letter]);
      isWordBeginning = true;
    } else {
      splittedWordsLetters[splittedWordsLetters.length - 1].push(letter);
      isWordBeginning = false;
    }
  }

  return joinArraysOfLettersToWords(splittedWordsLetters);
};

const splitWordsWithCaseChange = (words: Array<string>): Array<string> => {
  if (words.every((word) => isCaseless(word))) return words;

  return words.reduce((newWords: Array<string>, word) => {
    const splittedWords = splitWordWithCaseChange(word);
    return newWords.concat(splittedWords);
  }, []);
};

const lowerCaseWords = (words: Array<string>): Array<string> => (
  words.map((word) => word.toLowerCase())
);

const upperCaseWords = (words: Array<string>): Array<string> => (
  words.map((word) => word.toUpperCase())
);

const capitalizeWords = (words: Array<string>): Array<string> => (
  words
    .map((word) => {
      const [firstLetter, ...rest] = word;
      return `${firstLetter.toUpperCase()}${rest.join("")}`;
    })
);

const removeNonAlphaNumericChars = (
  unfilteredWords: Array<string>,
): Array<string> => {
  return unfilteredWords
    .map((word) => word.replace(/[^0-9a-z]/gi, ""))
    .filter(Boolean);
};

const createKebabCase = (words: Array<string>): string => words.join("-");

const createSnakeCase = (words: Array<string>): string => words.join("_");

const createFlatCase = (words: Array<string>): string => words.join("");

const createPascalCase = (words: Array<string>): string => (
  upperCaseWords(words).join("")
);

const createCamelCase = (words: Array<string>): string => {
  const [first, ...rest] = words;
  return `${first}${capitalizeWords(rest).join("")}`;
};

const createScreamingKebabCase = (words: Array<string>): string => (
  upperCaseWords(words).join("-")
);

const createScreamingSnakeCase = (words: Array<string>): string => (
  upperCaseWords(words).join("_")
);

const getPipeInput = async (): Promise<string> => {
  let pipedInput = "";
  if (Deno.isatty(Deno.stdin.rid)) return pipedInput;

  for await (const line of readLines(Deno.stdin)) {
    pipedInput += line;
  }

  return pipedInput;
};

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
