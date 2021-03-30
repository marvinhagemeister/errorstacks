const fs = require("fs");
const path = require("path");

const source = path.join(__dirname, "..", "dist", "esm", "index.js");
const dest = path.join(path.dirname(source), "index.mjs");

fs.writeFileSync(dest, fs.readFileSync(source));
