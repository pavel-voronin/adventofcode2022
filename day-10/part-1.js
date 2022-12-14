const fs = require("fs");
const path = require("path");

function runProgram(instructions) {
  const cycles = [1];

  for (const instruction of instructions) {
    if (instruction === "noop") {
      cycles.push(cycles.at(-1));
    } else if (instruction.startsWith("addx ")) {
      cycles.push(cycles.at(-1));
      cycles.push(cycles.at(-1) + +instruction.substring(5));
    }
  }

  return cycles;
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const instructions = input.split("\n");

  const cycles = runProgram(instructions);

  const desiredCycles = [20, 60, 100, 140, 180, 220];
  const strengths = desiredCycles.reduce(
    (acc, v) => [...acc, cycles[v - 1] * v],
    []
  );

  const sum = strengths.reduce((acc, v) => acc + v, 0);

  console.log(sum);
}

main();
