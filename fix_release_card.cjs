const fs = require("fs");
let content = fs.readFileSync("src/routes/releases.tsx", "utf-8");

// Replace the return of ReleaseCard
content = content.replace(
  "  return (\n    <motion.div\n      initial={{ opacity: 0, y: 20 }}",
  "  return (\n    <motion.div\n      id={`r${release.id}`}\n      initial={{ opacity: 0, y: 20 }}",
);

fs.writeFileSync("src/routes/releases.tsx", content);
