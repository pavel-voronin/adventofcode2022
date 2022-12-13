const fs = require("fs");
const path = require("path");

function getSequence(arr, y, x, direction) {
  let sequence = [];

  let currentCoords = [x, y];

  while (
    currentCoords[0] >= 0 &&
    currentCoords[0] < arr.length &&
    currentCoords[1] >= 0 &&
    currentCoords[1] < arr[0].length
  ) {
    sequence.push(arr[currentCoords[0]][currentCoords[1]]);

    if (direction === "up") {
      currentCoords[0] -= 1;
    } else if (direction === "right") {
      currentCoords[1] += 1;
    } else if (direction === "down") {
      currentCoords[0] += 1;
    } else if (direction === "left") {
      currentCoords[1] -= 1;
    }
  }

  return sequence;
}

function countVisibleTrees(forest) {
  let count = 0;

  for (let y = 0; y < forest.length; y++) {
    for (let x = 0; x < forest[y].length; x++) {
      // edges
      if (
        y === 0 ||
        y === forest.length - 1 ||
        x === 0 ||
        x === forest[y].length - 1
      ) {
        count++;

        continue;
      }

      const height = forest[y][x];

      let visible = false;

      for (const direction of ["up", "down", "left", "right"]) {
        const seq = getSequence(forest, x, y, direction);
        const filtered = seq.filter((v) => v >= height);

        if (filtered.length <= 1) {
          visible = true;
        }
      }

      if (visible) {
        count++;
        continue;
      }
    }
  }

  return count;
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const forest = input.split("\n").map((v) => v.match(/./g));

  const visibleTreesCount = countVisibleTrees(forest);

  console.log(visibleTreesCount);
}

main();
