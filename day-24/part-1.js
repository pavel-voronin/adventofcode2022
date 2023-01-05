const fs = require("fs");
const path = require("path");

class MapWithObjectKeys {
  constructor() {
    this.map = new Map();
  }

  get(key) {
    const serializedKey = JSON.stringify(key);
    return this.map.get(serializedKey);
  }

  set(key, value) {
    const serializedKey = JSON.stringify(key);
    this.map.set(serializedKey, value);
  }

  has(key) {
    const serializedKey = JSON.stringify(key);
    return this.map.has(serializedKey);
  }

  *entries() {
    for (const [key, value] of this.map.entries()) {
      yield [JSON.parse(key), value];
    }
  }
}

async function main() {
  console.time("execution");

  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const map = input.split("\n");

  const width = map[0].length - 2;
  const height = map.length - 2;

  let field = new MapWithObjectKeys();

  const start = [0, -1];
  const goal = [width - 1, height];

  // cut out field from map
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const list = [];

      const index = [">", "v", "<", "^"].indexOf(map[y + 1][x + 1]);
      if (index !== -1) list.push(index);

      field.set([x, y], list);
    }
  }

  let explored = new MapWithObjectKeys();
  explored.set(start, true);

  let round = 0;

  while (++round) {
    const newField = new MapWithObjectKeys();

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        newField.set([x, y], []);
      }
    }

    // move blizzards
    for (const [[x, y], blizzards] of field.entries()) {
      for (const blizzard of blizzards) {
        const [dx, dy] = [
          [1, 0],
          [0, 1],
          [-1, 0],
          [0, -1],
        ][blizzard];

        let newX = x + dx;
        let newY = y + dy;

        if (!newField.has([newX, newY])) {
          while (newField.has([newX - dx, newY - dy])) {
            newX -= dx;
            newY -= dy;
          }
        }

        newField.get([newX, newY]).push(blizzard);
      }
    }

    const newExplored = new MapWithObjectKeys();

    // look for possible moves
    for (const [[x, y]] of explored.entries()) {
      for (const [dx, dy] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]) {
        const newPos = [x + dx, y + dy];

        if (newField.get(newPos)?.length === 0) {
          newExplored.set(newPos, true);
        }

        if (newPos[0] === goal[0] && newPos[1] === goal[1]) {
          newExplored.set(newPos, true);
        }
      }

      if (newField.get([x, y])?.length === 0) {
        newExplored.set([x, y], true);
      }

      if (x === start[0] && y === start[1]) {
        newExplored.set([x, y], true);
      }
    }

    explored = newExplored;
    field = newField;

    if (explored.has(goal)) {
      break;
    }
  }

  console.log(round, round === 264);

  console.timeEnd("execution");
}

main();
