const path = require("path");
const fs = require("fs");

function parseBlueprints(input) {
  return input.split("\n").map((v) => {
    const [
      _,
      ore_ore,
      clay_ore,
      obsidian_ore,
      obsidian_clay,
      geode_ore,
      geode_obsidian,
    ] = v.match(
      /Blueprint \d+: Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./
    );

    return [
      {
        type: "ore",
        requiredTime: 16,
        cost: [{ resource: "ore", amount: +ore_ore }],
      },
      {
        type: "clay",
        requiredTime: 6,
        cost: [{ resource: "ore", amount: +clay_ore }],
      },
      {
        type: "obsidian",
        requiredTime: 3,
        cost: [
          { resource: "ore", amount: +obsidian_ore },
          { resource: "clay", amount: +obsidian_clay },
        ],
      },
      {
        type: "geode",
        requiredTime: 2,
        cost: [
          { resource: "ore", amount: +geode_ore },
          { resource: "obsidian", amount: +geode_obsidian },
        ],
      },
    ];
  });
}

function canAfford(robot, resources) {
  return robot.cost.every(
    ({ resource, amount }) => resources[resource] >= amount
  );
}

function sumObjects(obj1, obj2) {
  const result = {};

  for (const key of Object.keys(obj1)) {
    result[key] = obj1[key] + obj2[key];
  }

  return result;
}

function simulateRobotCrafting(robot, resources, bots, time) {
  resources = { ...resources };
  bots = { ...bots };

  // hoard resources

  while (!canAfford(robot, resources) && time > 0) {
    resources = sumObjects(resources, bots);
    time--;
  }

  resources = sumObjects(resources, bots);
  time--;

  // build the bot

  for (let { resource, amount } of robot.cost) {
    resources[resource] -= amount;
  }

  bots[robot.type]++;

  return { resources, bots, time };
}

function calculateBlueprint(blueprint, resources, bots, time) {
  let maxGeodes = 0;

  for (let robot of blueprint) {
    if (time < robot.requiredTime) continue;

    const simulation = simulateRobotCrafting(robot, resources, bots, time);

    if (simulation.time <= 0) {
      continue;
    }

    let score = robot.type === "geode" ? simulation.time : 0;

    score += calculateBlueprint(
      blueprint,
      simulation.resources,
      simulation.bots,
      simulation.time
    );

    maxGeodes = Math.max(maxGeodes, score);
  }

  return maxGeodes;
}

async function main() {
  console.time("execution");

  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const blueprints = parseBlueprints(input).slice(0, 3);
  const MINUTES = 32;

  const qualityLevelMul = blueprints.reduce(
    (acc, blueprint, i) =>
      acc *
      calculateBlueprint(
        blueprint,
        { ore: 0, clay: 0, obsidian: 0, geode: 0 },
        { ore: 1, clay: 0, obsidian: 0, geode: 0 },
        MINUTES
      ),
    1
  );

  console.log(qualityLevelMul);

  console.timeEnd("execution");
}

main();
