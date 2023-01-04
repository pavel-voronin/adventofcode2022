const fs = require("fs");
const path = require("path");

function checkNorth(elves, [x, y]) {
  if (elves.has(`${+x},${+y - 1}`)) return false;
  if (elves.has(`${+x - 1},${+y - 1}`)) return false;
  if (elves.has(`${+x + 1},${+y - 1}`)) return false;

  return true;
}

function checkSouth(elves, [x, y]) {
  if (elves.has(`${+x},${+y + 1}`)) return false;
  if (elves.has(`${+x - 1},${+y + 1}`)) return false;
  if (elves.has(`${+x + 1},${+y + 1}`)) return false;

  return true;
}

function checkEast(elves, [x, y]) {
  if (elves.has(`${+x + 1},${+y}`)) return false;
  if (elves.has(`${+x + 1},${+y - 1}`)) return false;
  if (elves.has(`${+x + 1},${+y + 1}`)) return false;

  return true;
}

function checkWest(elves, [x, y]) {
  if (elves.has(`${+x - 1},${+y}`)) return false;
  if (elves.has(`${+x - 1},${+y - 1}`)) return false;
  if (elves.has(`${+x - 1},${+y + 1}`)) return false;

  return true;
}

function checkUnique(elves, [x, y]) {
  let count = 0;

  for (let [_, { proposedX, proposedY }] of elves) {
    if (proposedX === x && proposedY === y) count++;
    if (count > 1) return false;
  }

  return true;
}

function move(elves) {
  for (const [coords, elf] of elves) {
    if (elf.isMoving && checkUnique(elves, [elf.proposedX, elf.proposedY])) {
      elves.delete(coords);
      elves.set(`${elf.proposedX},${elf.proposedY}`, elf);
    }

    elf.isMoving = false;
  }
}

function isAlone(elves, [x, y]) {
  x = +x;
  y = +y;

  const surroundingCells = (x, y) => {
    const dirs = [-1, 0, 1];

    return dirs
      .flatMap((i) => dirs.map((j) => [x + i, y + j]))
      .filter(([cx, cy]) => !(cx === x && cy === y));
  };

  return !surroundingCells(x, y).some(([x, y]) => elves.has(`${x},${y}`));
}

async function main() {
  console.time("execution");

  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const map = input.split("\n").map((v) => [...v]);
  const elves = new Map();

  map.forEach((line, y) => {
    line.forEach((char, x) => {
      if (char === "#")
        elves.set(`${x},${y}`, {
          proposedX: null,
          proposedY: null,
          isMoving: false,
        });
    });
  });

  let checks = [
    [checkNorth, [0, -1]],
    [checkSouth, [0, 1]],
    [checkWest, [-1, 0]],
    [checkEast, [1, 0]],
  ];
  let rounds = 10;

  while (rounds--) {
    for (let [coords, elf] of elves) {
      const [x, y] = coords.split(",");

      if (isAlone(elves, [x, y])) continue;

      for (let [check, [dx, dy]] of checks) {
        if (check(elves, [x, y])) {
          elf.proposedX = +x + dx;
          elf.proposedY = +y + dy;
          elf.isMoving = true;

          break;
        }
      }
    }

    checks.push(checks.shift());

    move(elves);
  }

  const x = [...elves.keys()].map((key) => +key.split(",")[0]);
  const y = [...elves.keys()].map((key) => +key.split(",")[1]);

  const width = Math.max(...x) - Math.min(...x) + 1;
  const height = Math.max(...y) - Math.min(...y) + 1;

  const emptyCount = width * height - elves.size;

  console.log(emptyCount, emptyCount === 3757);

  console.timeEnd("execution");
}

main();
