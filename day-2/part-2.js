const fs = require("fs");
const path = require("path");

function parseLine(str) {
  if (!str.match(/^[A-C] [X-Z]$/)) {
    console.error(`Wrong pattern: ${str}`);
    process.exit(1);
  }

  return str
    .replace("X", "lost")
    .replace("Y", "draw")
    .replace("Z", "win")
    .split(" ");
}

function simulateRound([first, intent]) {
  const scores = { A: 1, B: 2, C: 3 };

  const lost = 0;
  const draw = 3;
  const won = 6;

  const winningMoves = { A: "B", B: "C", C: "A" };
  const lostMoves = { A: "C", B: "A", C: "B" };

  if (intent === "lost") {
    return lost + scores[lostMoves[first]];
  }

  if (intent === "win") {
    return won + scores[winningMoves[first]];
  }

  if (intent === "draw") {
    return draw + scores[first];
  }
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const pairs = input.split("\n").map(parseLine);
  const results = pairs.map(simulateRound);

  const sum = results.reduce((acc, v) => acc + v, 0);

  console.log(sum);
}

main();
