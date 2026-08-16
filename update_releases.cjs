const fs = require("fs");
let content = fs.readFileSync("src/routes/releases.tsx", "utf-8");

// Insert useLocation import if not exists
if (!content.includes("useLocation")) {
  content = content.replace(
    'import { createFileRoute } from "@tanstack/react-router";',
    'import { createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";',
  );
}

// In the ReleasesPage component, add useEffect to handle hash
if (!content.includes("// Handle Hash Navigation for scroll")) {
  content = content.replace(
    "function ReleasesPage() {",
    `function ReleasesPage() {\n  const location = useLocation();\n  const navigate = useNavigate();\n\n  // Handle Hash Navigation for scroll\n  useEffect(() => {\n    const hash = location.hash;\n    if (!hash) return;\n    \n    const releaseId = hash.replace("#", "");\n    const el = document.getElementById(releaseId);\n    if (el) {\n      el.scrollIntoView({ behavior: "smooth", block: "center" });\n      // highlight or flash could be added here\n    }\n  }, [location.hash]);`,
  );
}

fs.writeFileSync("src/routes/releases.tsx", content);
