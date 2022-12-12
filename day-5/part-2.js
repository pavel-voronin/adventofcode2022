const fs = require("fs");
const path = require("path");

function parseStack(input) {
  const lines = input.split("\n");

  const stacksCount = Math.max(
    ...lines
      .at(-1)
      .trim()
      .split(/\s+/)
      .map((v) => +v)
  );

  const stack = new Map();

  for (let i = 1; i <= stacksCount; i++) {
    stack.set(i, []);

    for (let j = lines.length - 2; j >= 0; j--) {
      const tag = lines[j].substring((i - 1) * 4 + 1, (i - 1) * 4 + 2);

      if (tag !== " ") {
        stack.get(i).push(tag);
      } else {
        break;
      }
    }
  }

  return stack;
}

function parseMoves(input) {
  return [
    ...input.matchAll(
      /^move (?<amount>\d+) from (?<from>\d+) to (?<to>\d+)$/gm
    ),
  ].map(({ groups: { amount, from, to } }) => ({
    amount: +amount,
    from: +from,
    to: +to,
  }));
}

function move(stack, amount, from, to) {
  const temp = [];

  for (let i = 0; i < amount; i++) {
    temp.push(stack.get(from).pop());
  }

  for (let i = 0; i < amount; i++) {
    stack.get(to).push(temp.pop());
  }
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const [stackInput, movesInput] = input.split("\n\n");

  const stack = parseStack(stackInput);
  const moves = parseMoves(movesInput);

  for (let { amount, from, to } of moves) {
    move(stack, amount, from, to);
  }

  const topCrates = [...stack.values()].map((v) => v.at(-1));
  console.log(topCrates.join(""));
}

main();
