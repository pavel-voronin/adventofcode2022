const fs = require("fs");
const path = require("path");

function wrap(map, [x, y], [dx, dy]) {
  do {
    x = (x + dx + map[y].length) % map[y].length;
    y = (y + dy + map.length) % map.length;
  } while (map[y][x] === " ");

  return [x, y];
}

function next(map, steps, [x, y], [dx, dy]) {
  while (steps--) {
    let nextX = x + dx;
    let nextY = y + dy;

    if (map[nextY]?.[nextX] === undefined || map[nextY][nextX] === " ") {
      const [wrapX, wrapY] = wrap(map, [x, y], [dx, dy]);

      if (map[wrapY][wrapX] === "#") return [x, y];

      nextX = wrapX;
      nextY = wrapY;
    }

    if (map[nextY][nextX] === "#") return [x, y];

    x = nextX;
    y = nextY;
  }

  return [x, y];
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
  let pos = [map[0].indexOf("."), 0];

  for (const move of moves) {
    if (move === "R") direction = direction.cw;
    else if (move === "L") direction = direction.ccw;
    else pos = next(map, move, pos, direction.offset);
  }

  const password = (pos[1] + 1) * 1000 + (pos[0] + 1) * 4 + direction.value;

  console.log(password, password === 149138);

  console.timeEnd("execution");
}

main();
