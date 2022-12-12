const fs = require("fs");
const path = require("path");

function parseLine(str) {
  return str.split(",").map((v) => v.split("-").map((v) => +v));
}

function doRangesOverlap([first, second]) {
  return first[0] <= second[1] && second[0] <= first[1];
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const ranges = input.split("\n").map(parseLine);

  const overlappingRanges = ranges.filter(doRangesOverlap);

  console.log(overlappingRanges.length);
}

main();
