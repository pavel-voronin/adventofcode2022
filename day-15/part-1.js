const fs = require("fs");
const path = require("path");

function parseInput(input) {
  return input
    .split("\n")
    .map((v) => ({
      ...v.match(
        /x=(?<sensor_x>[-\d]+), y=(?<sensor_y>[-\d]+).*x=(?<beacon_x>[-\d]+), y=(?<beacon_y>[-\d]+)/
      ).groups,
    }))
    .map(({ sensor_x, sensor_y, beacon_x, beacon_y }) => [
      [+sensor_x, +sensor_y],
      [+beacon_x, +beacon_y],
    ]);
}

// Manhattan distance
function m([x1, y1], [x2, y2]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function countPaintedCells(segments, sensors, row) {
  const paintedCells = new Set();

  for (const [x1, x2] of segments) {
    for (let x = x1; x <= x2; x++) {
      const beaconXs = sensors
        .filter((v) => v[1][1] === row)
        .map((v) => v[1][0]);

      const sensorXs = sensors
        .filter((v) => v[0][1] === row)
        .map((v) => v[0][0]);

      if (!beaconXs.includes(x) && !sensorXs.includes(x)) paintedCells.add(x);
    }
  }

  return paintedCells.size;
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const sensors = parseInput(input);

  //   console.log(sensors);

  const row = 2_000_000;

  const painted = [];

  for (const [sensor, beacon] of sensors) {
    const distance = m(sensor, beacon);

    const onRow = distance * 2 + 1 - Math.abs(sensor[1] - row) * 2;
    const from = sensor[0] - Math.floor(onRow / 2);
    const to = from + onRow - 1;

    if (onRow <= 0) continue;

    painted.push([from, to]);
  }

  let count = countPaintedCells(painted, sensors, row);

  console.log(count);
}

main();
