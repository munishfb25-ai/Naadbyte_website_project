const fs = require("fs");
let content = fs.readFileSync("src/routes/music.index.tsx", "utf-8");

// Replace the premium search field
const searchHTML = `              {/* Premium Search Field */}
              <div className="relative w-full sm:w-[280px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Search songs, albums or genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-muted-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-colors"
                />
              </div>`;

content = content.replace(searchHTML, "");

fs.writeFileSync("src/routes/music.index.tsx", content);
