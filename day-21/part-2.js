const path = require("path");
const fs = require("fs");

function calculate(jobs, monkey) {
  const job = jobs[monkey];

  if (job.length === 1) return +job[0];

  let [a, op, b] = job;

  a = calculate(jobs, a);
  b = calculate(jobs, b);

  if (op === "-") return a - b;
  if (op === "+") return a + b;
  if (op === "/") return a / b;
  if (op === "*") return a * b;
}

function hasHUMN(jobs, monkey) {
  const [a, op, b] = jobs[monkey];

  if (op === undefined) return false;
  if (a === "humn") return true;
  if (b === "humn") return true;

  return hasHUMN(jobs, a) || hasHUMN(jobs, b);
}

async function main() {
  console.time("execution");

  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const jobs = {};

  input.split("\n").forEach((v) => {
    const [monkey, job] = v.split(": ");
    jobs[monkey] = job.split(" ");
  });

  const root = jobs["root"];
  const target = hasHUMN(jobs, root[0])
    ? calculate(jobs, root[2])
    : calculate(jobs, root[0]);
  const humnBranch = hasHUMN(jobs, root[0]) ? root[0] : root[2];

  const correlation =
    calculate({ ...jobs, humn: [0] }, humnBranch) <
    calculate({ ...jobs, humn: [1] }, humnBranch)
      ? 1
      : -1;

  let increment = 100000000000000;
  let value = 0;
  let underTarget = true;

  while (calculate(jobs, humnBranch) !== target) {
    const evaluated = calculate(jobs, humnBranch);

    if (evaluated > target) {
      if (underTarget) increment /= 10;
      underTarget = false;
      value -= increment * correlation;
    }

    if (evaluated < target) {
      if (!underTarget) increment /= 10;
      underTarget = true;
      value += increment * correlation;
    }

    jobs["humn"] = [value];
  }

  const result = jobs["humn"][0];

  console.log(result, result === 3378273370680);

  console.timeEnd("execution");
}

main();
