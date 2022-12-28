const path = require("path");
const fs = require("fs");

function isCollision(rock, pile) {
  for (let [x, y] of rock) {
    if (x <= 0 || x >= 8) return true;
    if (y <= 0) return true;
    if (pile.has(`${x},${y}`)) return true;
  }

  return false;
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

function* movesGenerator() {
  const moves = fs
    .readFileSync(path.join(__dirname, "input.txt"), "utf8")
    .toString()
    .trim();

  for (let i = 0, length = moves.length; ; i = (i + 1) % length) {
    const move = moves[i] === "<" ? -1 : 1;

    if ((yield [move, moves.substring(i)]) === "prev") {
      i--;
    }
  }
}

function shift(shape, [x, y]) {
  shape.forEach((point) => {
    point[0] += x;
    point[1] += y;
  });
}

function isFullPattern(shape, pile) {
  const pattern = [];

  const minY = Math.min(...shape.map(([_, y]) => y));
  const maxY = Math.max(...shape.map(([_, y]) => y));

  for (let y = minY; y <= maxY; y++) {
    for (let x = 1; x <= 7; x++) {
      if (pile.has(`${x},${y}`)) {
        pattern.push(x);
      }
    }
  }

  for (let y = minY; y <= maxY; y++) {
    for (let x = 1; x <= 7; x++) {
      if (!pile.has(`${x},${y}`)) {
        return false;
      }
    }

    return pattern.join("");
  }
}

async function main() {
  console.time("execution");

  const pile = new Set();
  const shapes = shapesGenerator();
  const moves = movesGenerator();
  const memory = new Map();
  let peak = 0;
  let placed = 0;
  let saved;

  const drop = () => {
    const shape = shapes.next().value;
    shift(shape, [3, peak + 4]);

    while (true) {
      // left, right

      const [move] = moves.next().value;

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

    return shape;
  };

  while (true) {
    let placedShape = drop();

    placed++;

    let pattern = isFullPattern(placedShape, pile);

    if (pattern) {
      const nextBlock = placed % 5;
      const [_, upcomingPattern] = moves.next("prev").value;

      if (memory.has(pattern)) {
        saved = memory.get(pattern);

        if (
          saved.nextBlock === nextBlock &&
          saved.upcomingPattern === upcomingPattern
        ) {
          break;
        }
      }

      memory.set(pattern, { nextBlock, upcomingPattern, peak, placed });
    }
  }

  const remaining = 1_000_000_000_000 - placed;
  let remainder = remaining % (placed - saved.placed);

  while (remainder--) drop();

  const result =
    Math.floor(remaining / (placed - saved.placed)) * (peak - saved.peak) +
    peak;

  console.log(result, result === 1577650429835);

  console.timeEnd("execution");
}

main();
