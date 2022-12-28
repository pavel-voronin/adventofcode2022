const path = require("path");
const fs = require("fs");

function* movesGenerator() {
  const moves = fs
    .readFileSync(path.join(__dirname, "input.txt"), "utf8")
    .toString()
    .trim()
    .split("")
    .map((v) => (v === "<" ? -1 : 1));

  for (let i = 0, length = moves.length; ; i = (i + 1) % length) {
    yield moves[i];
  }
}

function* shapesGenerator() {
  const shapes = JSON.parse(`[
    [[0,0],[1,0],[2,0],[3,0]],
    [[1,0],[0,1],[1,1],[2,1],[1,2]],
    [[0,0],[1,0],[2,0],[2,1],[2,2]],
    [[0,0],[0,1],[0,2],[0,3]],
    [[0,0],[1,0],[0,1],[1,1]]
  ]`);

  for (let i = 0, length = shapes.length; ; i = (i + 1) % length) {
    yield shapes[i].reduce((acc, v) => [...acc, [...v]], []);
  }
}

function shift(shape, [x, y]) {
  shape.forEach((point) => {
    point[0] += x;
    point[1] += y;
  });
}

function isCollision(shape, pile) {
  for (let [x, y] of shape) {
    if (x <= 0 || x >= 8) return true;
    if (y <= 0) return true;
    if (pile.has(`${x},${y}`)) return true;
  }

  return false;
}

async function main() {
  console.time("execution");

  const pile = new Set();
  const moves = movesGenerator();
  const shapes = shapesGenerator();
  let peak = 0;
  let DROPS = 2022;

  while (DROPS--) {
    const shape = shapes.next().value;
    shift(shape, [3, peak + 4]);

    while (true) {
      // left, right

      const move = moves.next().value;

      shift(shape, [move, 0]);

      if (isCollision(shape, pile)) {
        shift(shape, [-move, 0]);
      }

      // down

      shift(shape, [0, -1]);

      if (isCollision(shape, pile)) {
        shift(shape, [0, 1]);

        shape.forEach(([x, y]) => {
          pile.add(`${x},${y}`);
        });

        peak = Math.max(peak, ...shape.map(([_, y]) => y));

        break;
      }
    }
  }

  console.log(peak, peak === 3193 ? "OK" : "FAIL");

  console.timeEnd("execution");
}

main();
