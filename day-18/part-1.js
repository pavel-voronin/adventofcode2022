const path = require("path");
const fs = require("fs");

function isClosedSide(voxels, [x1, y1, z1], [ox, oy, oz]) {
  return (
    voxels.findIndex(
      ([x2, y2, z2]) => x1 + ox === x2 && y1 + oy === y2 && z1 + oz === z2
    ) !== -1
  );
}

function countOpenSides(voxels) {
  let count = 0;

  for (const voxel of voxels) {
    if (!isClosedSide(voxels, voxel, [0, 0, 1])) count++;
    if (!isClosedSide(voxels, voxel, [0, 0, -1])) count++;
    if (!isClosedSide(voxels, voxel, [0, 1, 0])) count++;
    if (!isClosedSide(voxels, voxel, [0, -1, 0])) count++;
    if (!isClosedSide(voxels, voxel, [1, 0, 0])) count++;
    if (!isClosedSide(voxels, voxel, [-1, 0, 0])) count++;
  }

  return count;
}

async function main() {
  console.time("execution");

  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const voxels = input.split("\n").map((v) => v.split(",").map((v) => +v));

  const result = countOpenSides(voxels);

  console.log(result, result === 4580);

  console.timeEnd("execution");
}

main();
