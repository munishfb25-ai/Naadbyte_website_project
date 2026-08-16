const fs = require("fs");
let content = fs.readFileSync("src/routes/music.index.tsx", "utf-8");

// Insert useLocation import if not exists
if (!content.includes("useLocation")) {
  content = content.replace(
    'import { createFileRoute } from "@tanstack/react-router";',
    'import { createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";',
  );
}

// In the MusicPage component, add useEffect to handle hash
if (!content.includes("// Handle Hash Navigation for Play/Filter")) {
  content = content.replace(
    "  const { currentTrack, status, controls } = useAudioPlayer();",
    `  const { currentTrack, status, controls } = useAudioPlayer();\n  const location = useLocation();\n  const navigate = useNavigate();\n\n  // Handle Hash Navigation for Play/Filter\n  useEffect(() => {\n    const hash = location.hash;\n    if (!hash) return;\n    \n    if (hash.startsWith("play-")) {\n      const songId = hash.replace("play-", "");\n      const song = dummySongs.find((s) => s.id === songId);\n      if (song) {\n        setActiveHeroSong(song);\n        controls.playQueue([toTrack(song)], 0);\n      }\n      // Clear hash gracefully without reloading\n      navigate({ to: "/music", replace: true });\n    } else if (hash.startsWith("filter-")) {\n      const filter = hash.replace("filter-", "");\n      setActiveFilter(filter);\n      navigate({ to: "/music", replace: true });\n    }\n  }, [location.hash]);`,
  );
}

// Remove the local search bar if requested? No, the user said "Create a GLOBAL SEARCH component that appears on every page... Do NOT create separate search bars for Music, Videos or Releases... Replace local search... wait."
// User actually said: "Do NOT create separate search bars for Music, Videos or Releases. Use one reusable GlobalSearch component inside the shared Header/Navbar."
// This means I should REMOVE the local search bar from the music page. Let me check if there is one.

fs.writeFileSync("src/routes/music.index.tsx", content);
