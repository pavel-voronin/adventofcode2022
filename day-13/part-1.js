const fs = require("fs");
const path = require("path");

function compare(a, b) {
  for (const i in a) {
    if (b[i] === undefined) return false; // Rule 2

    const _a = a[i];
    const _b = b[i];

    // Rule 1

    if (typeof _a === "number" && typeof _b === "number") {
      if (_a < _b) return true;
      if (_a > _b) return false;

      continue;
    }

    // Rule 3

    const comp = compare([_a].flat(), [_b].flat());

    if (comp !== undefined) {
      return comp;
    }
  }

  if (b.length > a.length) return true; // Rule 2
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const packets = input
    .split("\n\n")
    .map((v) => v.split("\n").map((v) => JSON.parse(v)));

  let indicesSum = 0;

  for (const i in packets) {
    const pair = packets[i];

    if (compare(...pair)) {
      indicesSum += +i + 1;
    }
  }

  console.log(indicesSum);
}

main();
