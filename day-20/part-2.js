const path = require("path");
const fs = require("fs");

function mix(encrypted) {
  let decrypted = [...encrypted];
  const length = encrypted.length;

  let count = 10;
  while (count--) {
    for (let i = 0; i < length; i++) {
      let num = encrypted[i].num;
      const idx = decrypted.indexOf(encrypted[i]);
      let newIdx = idx;

      if (num > 0) {
        num %= length - 1;

        while (num > 0) {
          if (newIdx == length - 1) newIdx = 0;
          newIdx++;
          num--;
        }
      }

      if (num < 0) {
        num = ((num * -1) % (length - 1)) * -1;

        while (num < 0) {
          if (newIdx == 0) newIdx = length - 1;
          newIdx--;
          num++;
        }
      }

      decrypted.splice(
        decrypted.findIndex((item) => item.idx === encrypted[i].idx),
        1
      );

      decrypted.splice(newIdx, 0, encrypted[i]);
    }
  }

  return decrypted;
}

async function main() {
  console.time("execution");

  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const encrypted = input.split("\n").map((v, idx) => {
    return { num: +v * 811589153, idx };
  });

  const decrypted = mix(encrypted);

  let idxOf0 = decrypted.indexOf(decrypted.find((item) => item.num === 0));

  const sum = [1000, 2000, 3000].reduce(
    (acc, idx) => acc + decrypted[(idx + idxOf0) % decrypted.length].num,
    0
  );

  console.log(sum, sum === 1538773034088);

  console.timeEnd("execution");
}

main();
