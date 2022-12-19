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
      Math.abs(+sensor_x - +beacon_x) + Math.abs(+sensor_y - +beacon_y),
    ]);
}

function solution(sensors, boundary) {
  const manhattanDistance = ([x1, y1], [x2, y2]) =>
    Math.abs(x1 - x2) + Math.abs(y1 - y2);

  const inSensorsDistance = (point) =>
    sensors.every(([sensor, dist]) => dist < manhattanDistance(point, sensor));

  for (const [[sx, sy], dist] of sensors) {
    for (const xo of [-1, 1]) {
      for (const yo of [-1, 1]) {
        for (let dx = 1; dx <= dist + 1; dx++) {
          const dy = dist + 1 - dx;

          const x = sx + dx * xo;
          const y = sy + dy * yo;

          if (!(x >= 0 && x <= boundary && y >= 0 && y <= boundary)) continue;

          if (inSensorsDistance([x, y])) {
            return x * boundary + y;
          }
        }
      }
    }
  }
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const sensors = parseInput(input);

  const BOUNDARY = 4000000;

  console.time(`execution`);

  const result = solution(sensors, BOUNDARY);
  console.log(result, result === 13673971349056 ? "OK" : "FAIL");

  console.timeEnd(`execution`);
}

main();
