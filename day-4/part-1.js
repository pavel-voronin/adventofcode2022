const fs = require("fs");
const path = require("path");

function parseLine(str) {
  return str.split(",").map((v) => v.split("-").map((v) => +v));
}

function fullyIntersects([first, second]) {
  function fullyIntersects(first, second) {
    return first[0] >= second[0] && first[1] <= second[1];
  }

  return fullyIntersects(first, second) || fullyIntersects(second, first);
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const ranges = input.split("\n").map(parseLine);

  const intersectedRanges = ranges.filter(fullyIntersects);

  console.log(intersectedRanges.length);
}

main();
