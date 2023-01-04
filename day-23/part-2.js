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
  let count = 0;

  for (const [coords, elf] of elves) {
    if (elf.isMoving && checkUnique(elves, [elf.proposedX, elf.proposedY])) {
      elves.delete(coords);
      elves.set(`${elf.proposedX},${elf.proposedY}`, elf);
      count++;
    }

    elf.isMoving = false;
  }

  for (const [_, elf] of elves) {
    elf.proposedX = null;
    elf.proposedY = null;
  }

  return count;
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
  let rounds = 0;

  while (++rounds) {
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

    if (move(elves) === 0) break;
  }

  console.log(rounds, rounds === 918);

  console.timeEnd("execution");
}

main();
