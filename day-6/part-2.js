const fs = require("fs");
const path = require("path");

function firstMarker(str, length) {
  for (let i = length - 1; i < str.length; i++) {
    if (new Set(str.substring(i - (length - 1), i + 1)).size === length) {
      return i + 1;
    }
  }

  return -1;
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();

  console.log(firstMarker(input, 14));
}

main();
