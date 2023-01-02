const path = require("path");
const fs = require("fs");

const calculate = (jobs, monkey) => {
  const job = jobs[monkey];

  let [a, op, b] = job;

  if (op === undefined) return +a;

  a = calculate(jobs, a);
  b = calculate(jobs, b);

  if (op === "-") return a - b;
  if (op === "+") return a + b;
  if (op === "/") return a / b;
  if (op === "*") return a * b;
};

async function main() {
  console.time("execution");

  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const jobs = {};

  input.split("\n").forEach((v) => {
    const [monkey, job] = v.split(": ");
    jobs[monkey] = job.split(" ");
  });

  const result = calculate(jobs, "root");

  console.log(result, result === 331120084396440);

  console.timeEnd("execution");
}

main();
