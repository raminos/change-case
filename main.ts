import { parse } from "https://deno.land/std/flags/mod.ts";
import { readLines } from "https://deno.land/std/io/bufio.ts";

const pipe = <R>(...fns: Array<(a: R) => R>) => (
  fns.reduce((prevFn, nextFn) => (value) => nextFn(prevFn(value)))
);

const splitWords = (input: string): Array<string> => {
  return input.split(/[ _-]/g);
};

const joinArraysOfLettersToWords = (arraysOfLetters: Array<Array<string>>): Array<string> => (
  arraysOfLetters.reduce((wordArray, letterArray) => {
    wordArray.push(letterArray.join(""));
    return wordArray;
  }, [])
)

const splitWordsWithCaseChange = (words: Array<string>): Array<string> => {
  return words.reduce((newWords: Array<string>, word) => {
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

    const splittedWords = joinArraysOfLettersToWords(splittedWordsLetters)
    return newWords.concat(splittedWords);
  }, []);
};

const lowerCaseWords = (words: Array<string>): Array<string> => (
  words.map((word) => word.toLowerCase())
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
  return `${first}${upperCaseWords(rest).join("")}`;
};

const upperCaseWords = (words: Array<string>): Array<string> => (
  words
    .map((word) => {
      const [firstLetter, ...rest] = word;
      return `${firstLetter.toUpperCase()}${rest.join("")}`;
    })
);

async function main(args: Array<string>): Promise<void> {
  const {
    kebab,
    camel,
    snake,
    pascal,
    flat,
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
      },
      boolean: [
        "k",
        "c",
        "s",
        "p",
        "f",
      ],
      stopEarly: true,
    },
  );

  let pipedInput = "";
  if (!Deno.isatty(Deno.stdin.rid)) {
    for await (const line of readLines(Deno.stdin)) {
      pipedInput += line;
    }
  }

  const input = argumentInput ? String(argumentInput) : pipedInput;
  const splittedWords = splitWords(input);
  const filteredInput = pipe(
    removeNonAlphaNumericChars,
    splitWordsWithCaseChange,
    lowerCaseWords,
  )(splittedWords);

  if (kebab) console.log(createKebabCase(filteredInput));
  if (snake) console.log(createSnakeCase(filteredInput));
  if (flat) console.log(createFlatCase(filteredInput));
  if (camel) console.log(createCamelCase(filteredInput));
  if (pascal) console.log(createPascalCase(filteredInput));
}

main(Deno.args);
