const fs = require("fs");
const path = require("path");

function parseMove(str) {
  const [direction, amount] = str.split(" ");

  return [direction, +amount];
}

function simulateRope(moves) {
  let head = [0, 0];
  let tail = [0, 0];

  const tailPositions = [tail];

  const shifts = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };
  const movePoint = (point, shift) => [
    point[0] + shift[0],
    point[1] + shift[1],
  ];
  const distance = (point1, point2) =>
    Math.max(Math.abs(point1[0] - point2[0]), Math.abs(point1[1] - point2[1]));
  const towards = (point1, point2) => {
    return [
      point2[0] !== point1[0] ? (point2[0] > point1[0] ? 1 : -1) : 0,
      point2[1] !== point1[1] ? (point2[1] > point1[1] ? 1 : -1) : 0,
    ];
  };

  for (let [direction, amount] of moves) {
    while (amount--) {
      head = movePoint(head, shifts[direction]);

      if (distance(head, tail) > 1) {
        // move tail
        tail = movePoint(tail, towards(tail, head));
        tailPositions.push(tail);
      }
    }
  }

  return { tailPositions };
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const moves = input.split("\n").map(parseMove);

  const { tailPositions } = simulateRope(moves);
  const uniquePositions = new Set(tailPositions.map((v) => v.join("-")));

  console.log(uniquePositions.size);
}

main();
