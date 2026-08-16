const fs = require("fs");
let content = fs.readFileSync("src/routes/about.tsx", "utf-8");

// The safest way is just to replace </p> where it closes a motion.p
content = content.replace(/<motion\.p([^>]*)>([\s\S]*?)<\/p>/g, "<motion.p$1>$2</motion.p>");

fs.writeFileSync("src/routes/about.tsx", content);
