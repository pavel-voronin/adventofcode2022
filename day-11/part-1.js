const fs = require("fs");
const path = require("path");

function parseItems(str) {
  return str.match(/\d+/g).map((v) => +v);
}

function parseOperation(str) {
  const operations = {
    "*": (op1) => (op2) => op1 * op2,
    "+": (op1) => (op2) => op1 + op2,
  };

  const { operation, operand } = str.match(
    /new = old (?<operation>.) (?<operand>\w+)/
  ).groups;

  if (operand === "old") {
    return (old) => operations[operation](old)(old);
  } else {
    return operations[operation](+operand);
  }
}

function parseTest(str) {
  const operand = +str.match(/divisible by (?<divider>\d+)/).groups.divider;

  return (num) => num % operand === 0;
}

function parseTarget(str) {
  return +str.match(/throw to monkey (?<target>\d+)/).groups.target;
}

function parseInput(input) {
  return input
    .split("\n\n")
    .map((v) => v.split("\n").slice(1))
    .map(([items, operation, test, trueTarget, falseTarget]) => ({
      items: parseItems(items),
      operation: parseOperation(operation),
      test: parseTest(test),
      trueTarget: parseTarget(trueTarget),
      falseTarget: parseTarget(falseTarget),
    }));
}

function runKeepAway(monkeys, rounds) {
  const inspections = monkeys.map((v) => 0);

  while (rounds--) {
    for (const i in monkeys) {
      const { items, operation, test, trueTarget, falseTarget } = monkeys[i];

      for (let worryLevel of items) {
        worryLevel = operation(worryLevel);
        worryLevel = Math.floor(worryLevel / 3);

        if (test(worryLevel)) {
          monkeys[trueTarget].items.push(worryLevel);
        } else {
          monkeys[falseTarget].items.push(worryLevel);
        }

        inspections[i]++;
      }

      monkeys[i].items = [];
    }
  }

  return { inspections };
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const monkeys = parseInput(input);

  const ROUNDS = 20;

  const { inspections } = runKeepAway(monkeys, ROUNDS);

  inspections.sort((a, b) => b - a);

  console.log(inspections[0] * inspections[1]);
}

main();
