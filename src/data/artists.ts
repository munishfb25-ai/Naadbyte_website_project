import type { Artist } from "@/types";

/** Future-ready: not rendered by any section yet. */
export const artists: Artist[] = [
  {
    id: "artist-naadbyte",
    slug: "naadbyte",
    name: "NaadByte",
    role: "Label · Production Collective",
    bio: "The in-house production collective behind every NaadByte release, blending Indian classical roots with modern electronic production.",
    socials: [
      { platform: "spotify", href: "https://open.spotify.com" },
      { platform: "youtube", href: "https://youtube.com" },
    ],
    isFeatured: true,
    status: "published",
  },
];
