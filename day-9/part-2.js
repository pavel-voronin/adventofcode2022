const fs = require("fs");
const path = require("path");

function parseMove(str) {
  const [direction, amount] = str.split(" ");

  return [direction, +amount];
}

function simulateRope(knotsCount, moves) {
  let knots = new Array(knotsCount).fill([0, 0]);

  const tailPositions = [knots.at(-1)];

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
      knots[0] = movePoint(knots[0], shifts[direction]);

      for (const index in knots) {
        if (index == 0) continue;

        if (distance(knots[index - 1], knots[index]) > 1) {
          // move tail
          knots[index] = movePoint(
            knots[index],
            towards(knots[index], knots[index - 1])
          );
        }
      }

      tailPositions.push(knots.at(-1));
    }
  }

  return { tailPositions };
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const moves = input.split("\n").map(parseMove);

  const { tailPositions } = simulateRope(10, moves);
  const uniquePositions = new Set(tailPositions.map((v) => v.join("-")));

  console.log(uniquePositions.size);
}

main();
