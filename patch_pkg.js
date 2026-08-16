const fs = require("fs");
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
pkg.scripts.build = "vite build && rm -rf dist && cp -r .output dist";
pkg.scripts.start = "node dist/server/index.mjs";
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
