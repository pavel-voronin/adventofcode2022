const path = require("path");
const fs = require("fs");

function mix(encrypted) {
  let decrypted = [...encrypted];
  const length = encrypted.length;

  for (let i = 0; i < length; i++) {
    let value = encrypted[i].num;
    const idx = decrypted.indexOf(encrypted[i]);
    let newIdx = idx;

    if (value > 0) {
      value %= length - 1;

      while (value > 0) {
        if (newIdx == length - 1) newIdx = 0;
        newIdx++;
        value--;
      }
    }

    if (value < 0) {
      value = ((value * -1) % (length - 1)) * -1;

      while (value < 0) {
        if (newIdx == 0) newIdx = length - 1;
        newIdx--;
        value++;
      }
    }

    decrypted.splice(
      decrypted.findIndex((item) => item.idx === encrypted[i].idx),
      1
    );

    decrypted.splice(newIdx, 0, encrypted[i]);
  }

  return decrypted;
}

async function main() {
  console.time("execution");

  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const encrypted = input.split("\n").map((v, idx) => {
    return { num: +v, idx };
  });

  const decrypted = mix(encrypted);

  const idxOf0 = decrypted.findIndex(({ num }) => num === 0);

  const sum = [1000, 2000, 3000].reduce(
    (acc, idx) => acc + decrypted[(idx + idxOf0) % decrypted.length].num,
    0
  );

  console.log(sum, sum === 2622);

  console.timeEnd("execution");
}

main();
