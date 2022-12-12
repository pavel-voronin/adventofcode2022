const fs = require("fs");
const path = require("path");

function parseLine(str) {
  if (str.length % 2 !== 0) {
    console.error(`Wrong length: ${str}`);
    process.exit(1);
  }

  return [str.substring(0, str.length / 2), str.substring(str.length / 2)];
}

function findSharedChar([str1, str2]) {
  const str1Chars = new Set(str1);

  for (const char of str2) {
    if (str1Chars.has(char)) {
      return char;
    }
  }

  console.error(`No shared chars`);
  process.exit(1);
}

function getCharOrder(char) {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return alphabet.indexOf(char) + 1;
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const backpacks = input.split("\n").map(parseLine);
  const chars = backpacks.map(findSharedChar).map(getCharOrder);
  const sum = chars.reduce((acc, v) => acc + v, 0);

  console.log(sum);
}

main();
