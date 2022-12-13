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

function countScenicScore(forest) {
  let maxScenicScore = 0;

  for (let y = 0; y < forest.length; y++) {
    for (let x = 0; x < forest[y].length; x++) {
      // skip edges
      if (
        y === 0 ||
        y === forest.length - 1 ||
        x === 0 ||
        x === forest[y].length - 1
      ) {
        continue;
      }

      const height = forest[y][x];
      let scenicScore = 1;

      for (const direction of ["up", "down", "left", "right"]) {
        const seq = getSequence(forest, x, y, direction).slice(1);

        const reducedSeq = [];

        for (const d of seq) {
          reducedSeq.push(d);

          if (d >= height) {
            break;
          }
        }

        scenicScore *= reducedSeq.length;
      }

      maxScenicScore = Math.max(maxScenicScore, scenicScore);
    }
  }

  return maxScenicScore;
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const forest = input.split("\n").map((v) => v.match(/./g));

  const maxScenicScore = countScenicScore(forest);

  console.log(maxScenicScore);
}

main();
