const fs = require("fs");
const path = require("path");

function firstMarker(str) {
  for (let i = 3; i < str.length; i++) {
    if (new Set(str.substring(i - 3, i + 1)).size === 4) {
      return i + 1;
    }
  }

  return -1;
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();

  console.log(firstMarker(input));
}

main();
