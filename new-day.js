const fs = require("fs");
const path = require("path");

const days = fs
  .readdirSync(__dirname)
  .filter((v) => v.match(/^day-\d+$/))
  .map((v) => +v.substring(4));

const nextDay = Math.max(...days) + 1;
const dayPath = path.join(__dirname, `day-${nextDay}`);

fs.mkdirSync(dayPath);
fs.writeFileSync(path.join(dayPath, "input.txt"), "");
fs.writeFileSync(path.join(dayPath, "part-1.js"), "");
fs.writeFileSync(path.join(dayPath, "part-2.js"), "");
