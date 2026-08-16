const fs = require("fs");
let content = fs.readFileSync("src/components/layout/Navbar.tsx", "utf-8");

content = content.replace(
  'import { RouteLink } from "@/components/common/RouteLink";\nimport { cn } from "@/lib/utils";',
  'import { RouteLink } from "@/components/common/RouteLink";\nimport { GlobalSearch } from "@/components/common/GlobalSearch";\nimport { cn } from "@/lib/utils";',
);

content = content.replace(
  '<div className="flex items-center gap-3">\n          <RouteLink to={routes.music} size="sm" className="hidden sm:inline-flex">\n            Listen Now\n          </RouteLink>\n          <button\n            type="button"\n            onClick={() => setOpen((v) => !v)}\n            aria-label={open ? "Close menu" : "Open menu"}\n            aria-expanded={open}\n            className="rounded-full border border-border p-2 text-foreground transition-colors hover:text-gold lg:hidden"\n          >\n            {open ? <X className="size-5" /> : <Menu className="size-5" />}\n          </button>\n        </div>',
  '<div className="flex items-center gap-3 md:gap-4 relative">\n          <GlobalSearch />\n          <RouteLink to={routes.music} size="sm" className="hidden sm:inline-flex shrink-0">\n            Listen Now\n          </RouteLink>\n          <button\n            type="button"\n            onClick={() => setOpen((v) => !v)}\n            aria-label={open ? "Close menu" : "Open menu"}\n            aria-expanded={open}\n            className="rounded-full border border-border p-2 text-foreground transition-colors hover:text-gold lg:hidden shrink-0"\n          >\n            {open ? <X className="size-5" /> : <Menu className="size-5" />}\n          </button>\n        </div>',
);

fs.writeFileSync("src/components/layout/Navbar.tsx", content);
