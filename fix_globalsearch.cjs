const fs = require("fs");
let content = fs.readFileSync("src/components/common/GlobalSearch.tsx", "utf-8");

// replace useRouter with useNavigate
content = content.replace(
  'useRouter } from "@tanstack/react-router";',
  'useNavigate } from "@tanstack/react-router";',
);
content = content.replace("const router = useRouter();", "const navigate = useNavigate();");
content = content.replace(
  "router.navigate({ to: item.url as any });",
  "navigate({ to: item.url, replace: false });",
);

fs.writeFileSync("src/components/common/GlobalSearch.tsx", content);
