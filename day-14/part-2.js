const fs = require("fs");
const path = require("path");

// cut line into segments
function cutSegments(points) {
  return points.reduce((pairs, point, index) => {
    if (index < points.length - 1) {
      pairs.push([point, points[index + 1]]);
    }

    return pairs;
  }, []);
}

// format point as [x, y] array and sort segment points
function formatSegment(segment) {
  segment = segment.map((v) => v.split(",").map((v) => +v));

  segment.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));

  return segment;
}

// convenient list of segments from raw input
function makeSegments(input) {
  const segments = input
    .split("\n") // segmented lines
    .map((v) => v.split(" -> ")) // points of segmented lines
    .map(cutSegments) // cut line into segments
    .flat() // just segments, no need to remember lines
    .map(formatSegment) // point as [x, y] array and sort segment points
    .reduce(
      // group segments by direction (for optimization)
      (acc, v) => {
        if (v[0][0] == v[1][0]) {
          acc.v.push(v);
        } else {
          acc.h.push(v);
        }

        acc.ground = Math.max(acc.ground, v[0][1], v[1][1]);
        acc.left = Math.min(acc.left, v[0][0], v[1][0]);
        acc.right = Math.max(acc.right, v[0][0], v[1][0]);

        return acc;
      },
      { v: [], h: [], ground: 0, left: Infinity, right: -Infinity }
    );

  segments.ground += 2;

  return segments;
}

function makeMap(input) {
  const { left, right, ground, v, h } = makeSegments(input);

  const rows = ground + 1;
  const cols = right - left + 1;

  const map = Array.from(Array(rows), () => Array(cols).fill(0));

  for (const segment of v) {
    const x = segment[0][0] - left;

    for (let y = segment[0][1]; y <= segment[1][1]; y++) {
      map[y][x] = 1;
    }
  }

  for (const segment of h) {
    const y = segment[0][1];

    for (let x = segment[0][0]; x <= segment[1][0]; x++) {
      map[y][x - left] = 1;
    }
  }

  return { map, left };
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const segments = makeSegments(input);
  const sandSource = [500, 0];
  const sandSourceX = sandSource[0];
  const sandSourceY = sandSource[1];

  let count = 1;
  let prevLine = [1];
  let offset = 1;

  console.time("algo");
  const { map, left } = makeMap(input);

  for (let y = sandSourceY + 1; y < segments.ground; y++) {
    let line = [];
    prevLine = [0, ...prevLine, 0];

    for (let x = sandSourceX - offset; x <= sandSourceX + offset; x++) {
      const tile = map[y][x - left];

      if (tile) {
        line.push(0);
      } else {
        const i = line.length;

        if (prevLine[i] || prevLine[i - 1] || prevLine[i + 1]) {
          line.push(1);
          count++;
        } else {
          line.push(0);
        }
      }
    }

    offset++;
    prevLine = [...line];
  }
  console.timeEnd("algo");

  console.log("Grits count:", count, count === 26686 ? "OK" : "FAIL");
}

main();
