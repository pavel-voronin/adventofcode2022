const fs = require("fs");
const path = require("path");

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();

  const inventories = input
    .split("\n\n")
    .map((v) => v.split("\n").map((v) => +v));

  let sums = inventories.map((v) => v.reduce((acc, v) => acc + v, 0));

  sums.sort((a, b) => b - a);

  const sum = sums.slice(0, 3).reduce((acc, v) => acc + v, 0);

  console.log(sum);
}

main();
