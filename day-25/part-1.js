const fs = require("fs");
const path = require("path");

function main() {
  console.time(`execution`);

  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const lines = input.split("\n");
  const characters = "=-012";

  let total = 0;

  for (const line of lines) {
    let sum = 0;

    for (let p = 0; p < line.length; p++) {
      const c = line[line.length - 1 - p];
      const n = characters.indexOf(c);
      sum += (n - 2) * Math.pow(5, p);
    }

    total += sum;
  }

  let snafu = "";

  do {
    let digit = total % 5;

    total = Math.floor(total / 5);

    if (digit > 2) {
      digit -= 5;
      total++;
    }
    snafu = characters[digit + 2] + snafu;
  } while (total !== 0);

  console.log(snafu, snafu === "20==1==12=0111=2--20");

  console.timeEnd(`execution`);
}

main();
