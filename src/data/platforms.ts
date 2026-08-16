import type { Platform } from "@/types";

/** Every label-level platform profile, streaming and social. */
export const platformDirectory: Platform[] = [
  {
    id: "pf-spotify",
    key: "spotify",
    name: "Spotify",
    href: "https://open.spotify.com",
    kind: "streaming",
    order: 1,
  },
  {
    id: "pf-apple-music",
    key: "appleMusic",
    name: "Apple Music",
    href: "https://music.apple.com",
    kind: "streaming",
    order: 2,
  },
  {
    id: "pf-youtube-music",
    key: "youtubeMusic",
    name: "YouTube Music",
    href: "https://music.youtube.com",
    kind: "streaming",
    order: 3,
  },
  {
    id: "pf-amazon-music",
    key: "amazonMusic",
    name: "Amazon Music",
    href: "https://music.amazon.com",
    kind: "streaming",
    order: 4,
  },
  {
    id: "pf-instagram",
    key: "instagram",
    name: "Instagram",
    href: "https://instagram.com",
    kind: "social",
    order: 5,
  },
  {
    id: "pf-facebook",
    key: "facebook",
    name: "Facebook",
    href: "https://facebook.com",
    kind: "social",
    order: 6,
  },
  {
    id: "pf-youtube",
    key: "youtube",
    name: "YouTube",
    href: "https://youtube.com",
    kind: "social",
    order: 7,
  },
];

/**
 * Ordered keys rendered in the "Listen Everywhere" strip and the footer.
 * Editing these arrays changes the UI without touching components.
 */
export const listenEverywhereKeys = [
  "spotify",
  "appleMusic",
  "youtubeMusic",
  "amazonMusic",
  "instagram",
  "facebook",
] as const;

export const socialKeys = ["youtube", "instagram", "facebook", "spotify"] as const;
