const fs = require("fs");
const path = require("path");

function parseLine(str) {
  if (!str.match(/^[A-C] [X-Z]$/)) {
    console.error(`Wrong pattern: ${str}`);
    process.exit(1);
  }

  return str.replace("X", "A").replace("Y", "B").replace("Z", "C").split(" ");
}

function simulateRound([first, second]) {
  const scores = { A: 1, B: 2, C: 3 };

  const lost = 0;
  const draw = 3;
  const won = 6;

  const winningMoves = { A: "B", B: "C", C: "A" };

  if (first === second) {
    return draw + scores[first];
  }

  if (winningMoves[first] === second) {
    return won + scores[second];
  }

  return lost + scores[second];
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const pairs = input.split("\n").map(parseLine);
  const results = pairs.map(simulateRound);

  const sum = results.reduce((acc, v) => acc + v, 0);

  console.log(sum);
}

main();
