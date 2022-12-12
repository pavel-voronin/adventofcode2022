const fs = require("fs");
const path = require("path");

function sharedChars(...strings) {
  const chars1 = new Set(strings[0]);

  const shared = new Set();

  for (const char of chars1) {
    let isShared = true;

    for (let i = 1; i < strings.length; i++) {
      if (!new Set(strings[i]).has(char)) {
        isShared = false;
        break;
      }
    }

    if (isShared) {
      shared.add(char);
    }
  }

  return Array.from(shared);
}

function chunk(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
}

function getCharOrder(char) {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return alphabet.indexOf(char) + 1;
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const backpacks = input.split("\n");
  const groups = chunk(backpacks, 3);

  const badgeChars = groups
    .map((v) => sharedChars(...v))
    .map(([v]) => v)
    .map(getCharOrder);

  const sum = badgeChars.reduce((acc, v) => acc + v, 0);

  console.log(sum);
}

main();
