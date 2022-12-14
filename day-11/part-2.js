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

function parseTestOperand(str) {
  const operand = +str.match(/divisible by (?<divider>\d+)/).groups.divider;

  return operand;
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
      testOperand: parseTestOperand(test),
      trueTarget: parseTarget(trueTarget),
      falseTarget: parseTarget(falseTarget),
    }));
}

function runKeepAway(monkeys, rounds) {
  const inspections = monkeys.map(() => 0);
  const divisionModulo = monkeys
    .map((v) => v.testOperand)
    .reduce((acc, v) => acc * v);

  while (rounds--) {
    for (const monkeyIndex in monkeys) {
      const { items, operation, test, trueTarget, falseTarget } =
        monkeys[monkeyIndex];

      for (let worryLevel of items) {
        worryLevel = operation(worryLevel);

        const target = test(worryLevel) ? trueTarget : falseTarget;
        monkeys[target].items.push(worryLevel % divisionModulo);

        inspections[monkeyIndex]++;
      }

      monkeys[monkeyIndex].items = [];
    }
  }

  return { inspections };
}

async function main() {
  const ROUNDS = 10000;

  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const monkeys = parseInput(input);

  const { inspections } = runKeepAway(monkeys, ROUNDS);

  inspections.sort((a, b) => b - a);

  const monkeyBusiness = inspections[0] * inspections[1];

  console.log(monkeyBusiness);
}

main();
