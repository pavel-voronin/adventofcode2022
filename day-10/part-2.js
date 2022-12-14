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

  for (const cycle in cycles) {
    const c = cycle % 40;

    if (c === 0) {
      console.log("");
    }

    const x = cycles[cycle];

    let symbol = ".";

    if (c >= x - 1 && c <= x + 1) {
      symbol = "#";
    }

    process.stdout.write(symbol);
  }
}

main();
