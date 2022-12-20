const fs = require("fs");
const path = require("path");

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

const distanceCache = {};

function distance(map, from, to) {
  // cache
  const key = from < to ? from + to : to + from;
  if (key in distanceCache) return distanceCache[key];

  const been = {};
  const queue = [from];
  let distance = 0;

  while (queue.length > 0) {
    for (const valve of queue.splice(0)) {
      // optimization
      if (valve in been) {
        continue;
      } else {
        been[valve] = 1;
      }

      // we arrived
      if (valve === to) {
        distanceCache[key] = distance;
        return distance;
      }

      // plan next round
      for (let to of map[valve].to) {
        queue.push(to);
      }
    }

    distance++;
  }
}

function findMaxPressure(map, from, timeLimit, to) {
  let maxPressure = 0;

  for (const valve of to) {
    const time = timeLimit - distance(map, from, valve) - 1;

    if (time <= 0) continue;

    const nextPressure = findMaxPressure(
      map,
      valve,
      time,
      [...to].filter((v) => v !== valve)
    );

    maxPressure = Math.max(time * map[valve].rate + nextPressure, maxPressure);
  }

  return maxPressure;
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const map = parseInput(input);

  console.time("execution");

  const valuableValves = Object.entries(map)
    .filter(([, { rate }]) => {
      return rate > 0;
    })
    .map(([k]) => k);

  const maxPressure = findMaxPressure(map, "AA", 30, valuableValves);
  console.log(maxPressure);

  console.timeEnd("execution");
}

main();
