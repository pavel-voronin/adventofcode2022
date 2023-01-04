const fs = require("fs");
const path = require("path");

const FACE_SIZE = 50;

function face([x, y]) {
  x = ~~(x / FACE_SIZE);
  y = ~~(y / FACE_SIZE);

  if (x === 1 && y === 0) return 1;
  if (x === 2 && y === 0) return 2;
  if (x === 1 && y === 1) return 3;
  if (x === 0 && y === 2) return 4;
  if (x === 1 && y === 2) return 5;
  if (x === 0 && y === 3) return 6;
}

function facePos(map, face) {
  for (let y = 0; y < map.length; y += FACE_SIZE) {
    for (let x = 0; x < map[y].length; x += FACE_SIZE) {
      if (map[y]?.[x] !== undefined && map[y][x] !== " ")
        if (--face === 0) return [x, y];
    }
  }
}

function wrap(map, [x, y], { value: direction }) {
  const wraps = {
    1: { 2: [4, 0], 3: [6, 0] },
    2: { 0: [5, 2], 1: [3, 2], 3: [6, 3] },
    3: { 0: [2, 3], 2: [4, 1] },
    4: { 2: [1, 0], 3: [3, 0] },
    5: { 0: [2, 2], 1: [6, 2] },
    6: { 0: [5, 3], 1: [2, 1], 2: [1, 1] },
  };

  const faceNum = face([x, y]);
  const [newFace, newDirection] = wraps[faceNum][direction];
  let [newX, newY] = facePos(map, newFace);

  if (direction === 0) {
    if (newDirection === 2) {
      newX += FACE_SIZE - 1;
      newY += FACE_SIZE - (y % FACE_SIZE) - 1;
    }
    if (newDirection === 3) {
      newY += FACE_SIZE - 1;
      newX += y % FACE_SIZE;
    }
  }

  if (direction === 1) {
    if (newDirection === 1) newX += x % FACE_SIZE;
    if (newDirection === 2) {
      newX += FACE_SIZE - 1;
      newY += x % FACE_SIZE;
    }
  }

  if (direction === 2) {
    if (newDirection === 0) newY += FACE_SIZE - (y % FACE_SIZE) - 1;
    if (newDirection === 1) newX += y % FACE_SIZE;
  }

  if (direction === 3) {
    if (newDirection === 0) newY += x % FACE_SIZE;
    if (newDirection === 3) {
      newX += x % FACE_SIZE;
      newY += FACE_SIZE - 1;
    }
  }

  return { pos: [newX, newY], direction: makeDirection(newDirection) };
}

function next(map, steps, [x, y], direction) {
  while (steps--) {
    const [dx, dy] = direction.offset;
    let nextX = x + dx;
    let nextY = y + dy;

    if (map[nextY]?.[nextX] === undefined || map[nextY][nextX] === " ") {
      const {
        pos: [wrapX, wrapY],
        direction: newDir,
      } = wrap(map, [x, y], direction);

      if (map[wrapY][wrapX] === "#") return { x, y, direction };

      nextX = wrapX;
      nextY = wrapY;
      direction = newDir;
    }

    if (map[nextY][nextX] === "#") {
      return { x, y, direction };
    }

    x = nextX;
    y = nextY;
  }

  return { x, y, direction };
}

function makeDirection(i) {
  const directions = [
    { offset: [1, 0], value: 0 },
    { offset: [0, 1], value: 1 },
    { offset: [-1, 0], value: 2 },
    { offset: [0, -1], value: 3 },
  ];

  directions.forEach((_, i, arr) => {
    arr[i].cw = arr[(i + 1) % 4];
    arr[i].ccw = arr[(i + 3) % 4];
  });

  return directions[i];
}

async function main() {
  console.time("execution");

  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const [map, moves] = input
    .split("\n\n")
    .map((v, i) => [(v) => v.split("\n"), (v) => v.match(/\d+|R|L/g)][i](v));

  let direction = makeDirection(0);
  let y = 0;
  let x = map[y].indexOf(".");

  for (const move of moves) {
    if (move === "R") direction = direction.cw;
    else if (move === "L") direction = direction.ccw;
    else ({ x, y, direction } = next(map, move, [x, y], direction));
  }

  const password = (y + 1) * 1000 + (x + 1) * 4 + direction.value;

  console.log(password, password === 153203);

  console.timeEnd("execution");
}

main();
