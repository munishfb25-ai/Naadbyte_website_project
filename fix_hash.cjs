const fs = require("fs");

function fixFile(file) {
  let content = fs.readFileSync(file, "utf-8");
  content = content.replace(
    "const hash = location.hash;",
    'const hash = location.hash.replace("#", "");',
  );
  fs.writeFileSync(file, content);
}

fixFile("src/routes/music.index.tsx");
fixFile("src/routes/videos.tsx");
