const fs = require("fs");
const path = require("path");

function findTiles(map, desired) {
  const found = {};

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (desired.includes(map[y][x])) {
        found[map[y][x]] = [x, y];
      }
    }
  }

  return found;
}

function findNextTiles(map, [x, y]) {
  return [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ].filter((tile) => {
    if (
      tile[1] < 0 ||
      tile[0] < 0 ||
      tile[1] >= map.length ||
      tile[0] >= map[0].length
    ) {
      return false;
    }

    if (map[tile[1]][tile[0]].charCodeAt(0) <= map[y][x].charCodeAt(0) + 1) {
      return true;
    }

    if (map[tile[1]][tile[0]] === "a" && map[y][x] === "S") {
      return true;
    }

    if (map[tile[1]][tile[0]] === "E") {
      return true;
    }

    return false;
  });
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const map = input.split("\n").map((v) => v.match(/./g));

  const { S: start, E: end } = findTiles(map, ["S", "E"]);

  const journey = [[start, 0]];
  const been = new Set();

  while (journey.length) {
    const [tile, steps] = journey.shift();

    if (been.has(tile.toString())) {
      continue;
    }

    been.add(tile.toString());

    if (tile.toString() === end.toString()) {
      console.log(steps);
      process.exit(0);
    }

    findNextTiles(map, tile).forEach((neighbor) =>
      journey.push([neighbor, steps + 1])
    );
  }
}

main();
