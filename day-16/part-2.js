const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

function parseInput(input) {
  return input.split("\n").reduce((map, v) => {
    let [, name, rate, to] = v.match(
      /Valve ([A-Z]{2}) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z, ]+)/
    );

    to = to.split(", ");
    rate = +rate;

    return { ...map, [name]: { to, rate } };
  }, {});
}

function findMaxPressure(map, from, timeLimit) {
  const cache = {};
  const opened = new Map();

  function recursive(time, human, elephant) {
    const flooded = [...opened.entries()].reduce(
      (sum, [k, v]) => sum + (v ? v * map[k].rate : 0),
      0
    );

    if (!time) {
      return flooded;
    } else {
      const key = `${time}${human}${elephant}`;
      if (key in cache && cache[key] >= flooded) {
        return 0;
      } else {
        cache[key] = flooded;
      }
    }

    let maxPressure = 0;

    for (const nextHuman of [human, ...map[human].to]) {
      if (human === nextHuman) {
        if (opened.has(human) || !map[human].rate) continue;
        opened.set(human, time);
      }

      if (elephant) {
        for (const nextElephant of [elephant, ...map[elephant].to]) {
          if (elephant === nextElephant) {
            if (opened.has(elephant) || !map[elephant].rate) continue;
            opened.set(elephant, time);
          }

          maxPressure = Math.max(
            maxPressure,
            recursive(time - 1, nextHuman, nextElephant)
          );

          if (elephant === nextElephant) opened.delete(elephant);
        }
      } else {
        maxPressure = Math.max(
          maxPressure,
          recursive(time - 1, nextHuman, elephant)
        );
      }

      if (human === nextHuman) opened.delete(human);
    }

    return maxPressure;
  }

  return recursive(timeLimit - 1, from, from);
}

async function main() {
  const data = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const map = parseInput(data);

  console.time("execution");
  const result = findMaxPressure(map, "AA", 26);
  console.timeEnd("execution");

  console.log(
    result,
    result === 2117 ? chalk.green("OK") : chalk.red.bold("FAIL")
  );
}

main();
