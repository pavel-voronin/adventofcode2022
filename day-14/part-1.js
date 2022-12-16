const fs = require("fs");
const path = require("path");

function cutSegments(points) {
  return points.reduce((pairs, point, index) => {
    if (index < points.length - 1) {
      pairs.push([point, points[index + 1]]);
    }

    return pairs;
  }, []);
}

function formatSegment(segment) {
  segment = segment.map((v) => v.split(",").map((v) => +v));

  segment.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));

  return segment;
}

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
        return acc;
      },
      { v: [], h: [] }
    );

  segments.v.sort((a, b) => a[0][1] - b[0][1]);
  segments.h.sort((a, b) => a[0][0] - b[0][0]);

  return segments;
}

function getTile({ segments, sand }, [x, y]) {
  if (
    segments.h
      .filter((v) => v[0][1] === y)
      .some((v) => v[0][0] <= x && x <= v[1][0])
  ) {
    return "#";
  }

  if (
    segments.v
      .filter((v) => v[0][0] === x)
      .some((v) => v[0][1] <= y && y <= v[1][1])
  ) {
    return "#";
  }

  if (sand.findIndex((v) => v[0] === x && v[1] === y) !== -1) {
    return "o";
  }

  return " ";
}

function hasGround({ segments }, [x, y]) {
  return (
    segments.h.some((v) => v[0][1] >= y && v[0][0] <= x && x <= v[1][0]) ||
    segments.v.some((v) => v[0][1] >= y && v[0][0] === x)
  );
}

function findPlace({ segments, sand }, [x, y]) {
  while (1) {
    let tile = getTile({ segments, sand }, [x, y]);

    if (tile == " ") {
      y++;
    } else {
      const leftBottomTile = getTile({ segments, sand }, [x - 1, y]);

      if (leftBottomTile === " ") {
        x--;
        y++;

        if (!hasGround({ segments }, [x, y])) {
          return false;
        }
      } else {
        const rightBottomTile = getTile({ segments, sand }, [x + 1, y]);

        if (rightBottomTile === " ") {
          x++;
          y++;

          if (!hasGround({ segments }, [x, y])) {
            return false;
          }
        } else {
          y--;
          break;
        }
      }
    }
  }

  return [x, y];
}

async function main() {
  console.time("execution time");

  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const segments = makeSegments(input);
  const sandSource = [500, 0];
  const sand = [];
  console.timeLog("execution time", "parsing ended, starting generate sand");

  while (1) {
    const grit = findPlace({ segments, sand }, sandSource);

    if (grit) {
      sand.push(grit);
    } else {
      break;
    }
  }

  console.log("Grits count:", sand.length);
  console.timeEnd("execution time");
}

main();
