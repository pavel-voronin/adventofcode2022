const fs = require("fs");
const path = require("path");

class Dir {
  name;
  #parent;

  dirs = {};
  files = {};
  size = 0;

  constructor(name, parent = null) {
    this.name = name;
    this.#parent = parent;
  }

  addSize(size) {
    this.size += size;

    if (this.#parent) {
      this.#parent.addSize(size);
    }
  }

  addDir(name) {
    if (!(name in this.dirs)) {
      this.dirs[name] = new Dir(name, this);
    }
  }

  addFile(name, size) {
    if (!(name in this.files)) {
      this.files[name] = size;
      this.addSize(size);
    }
  }

  getParent() {
    return this.#parent;
  }
}

function buildTree(history) {
  const tree = new Dir("/");
  let currentDir = tree;

  for (const line of history) {
    if (line.startsWith("$ cd ")) {
      const folder = line.substring(5);

      if (folder === "/") {
        currentDir = tree;
      } else if (folder === "..") {
        currentDir = currentDir.getParent();
      } else {
        currentDir = currentDir.dirs[folder];
      }
    } else if (line.startsWith("$ ls")) {
    } else if (line.startsWith("dir ")) {
      const name = line.substring(4);
      currentDir.addDir(name);
    } else if (line.match(/^\d+ [\w\.]+$/)) {
      const { size, name } = line.match(
        /^(?<size>\d+) (?<name>[\w\.]+)$/
      ).groups;

      currentDir.addFile(name, +size);
    }
  }

  return tree;
}

function getFoldersWithSizeLessThan(dir, threshold) {
  let folders = [];

  function traverse(dir) {
    if (dir.size < threshold) {
      folders.push(dir);
    }

    for (let subdir of Object.values(dir.dirs)) {
      traverse(subdir);
    }
  }

  traverse(dir);

  return folders;
}

async function main() {
  const input = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
  const history = input.split(/\n/);

  const tree = buildTree(history);

  const foldersLess100k = getFoldersWithSizeLessThan(tree, 100_000);

  const sizes = foldersLess100k.map(({ size }) => size);

  const sum = sizes.reduce((acc, v) => acc + v, 0);

  console.dir(sum);
}

main();
