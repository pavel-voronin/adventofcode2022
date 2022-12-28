const path = require("path");
const fs = require("fs");

function countSiblings(voxels, x, y, z) {
  let count = 0;

  if (voxels.has(`${x + 1},${y},${z}`)) count++;
  if (voxels.has(`${x - 1},${y},${z}`)) count++;
  if (voxels.has(`${x},${y + 1},${z}`)) count++;
  if (voxels.has(`${x},${y - 1},${z}`)) count++;
  if (voxels.has(`${x},${y},${z + 1}`)) count++;
  if (voxels.has(`${x},${y},${z - 1}`)) count++;

  return count;
}

async function main() {
  console.time("execution");

  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const voxels = new Set(input.split("\n"));

  let MIN = Number.MAX_SAFE_INTEGER;
  let MAX = Number.MIN_SAFE_INTEGER;

  for (let cube of voxels) {
    let [x, y, z] = cube.split(",").map((n) => parseInt(n));
    MIN = Math.min(MIN, x, y, z);
    MAX = Math.max(MAX, x, y, z);
  }

  let visited = new Set();

  let surface = 0;
  let queue = [[0, 0, 0]];

  while (queue.length > 0) {
    let [x, y, z] = queue.shift();

    if (visited.has(`${x},${y},${z}`)) continue;
    if (voxels.has(`${x},${y},${z}`)) continue;
    if (x < MIN - 1 || y < MIN - 1 || z < MIN - 1) continue;
    if (x > MAX + 1 || y > MAX + 1 || z > MAX + 1) continue;

    visited.add(`${x},${y},${z}`);

    surface += countSiblings(voxels, x, y, z);

    queue.push([x + 1, y, z]);
    queue.push([x - 1, y, z]);
    queue.push([x, y + 1, z]);
    queue.push([x, y - 1, z]);
    queue.push([x, y, z + 1]);
    queue.push([x, y, z - 1]);
  }

  console.log(surface, surface === 2610);

  console.timeEnd("execution");
}

main();
