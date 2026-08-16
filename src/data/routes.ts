/**
 * Single source of truth for every URL in the app.
 *
 * UI code must never hardcode a path — import `routes` (or the helpers) so a
 * future CMS/permalink change stays a one-file edit.
 */

export const routes = {
  home: "/",
  music: "/music",
  song: "/music/$slug",
  releases: "/releases",
  videos: "/videos",
  about: "/about",
  contact: "/contact",
  createYourSong: "/create-your-song",
  blog: "/blog",
  privacy: "/privacy",
  terms: "/terms",
} as const;

export type RoutePath = (typeof routes)[keyof typeof routes];

/** Builds the canonical URL for a song detail page. */
export const songPath = (slug: string) => `/music/${slug}`;

/** Builds the canonical URL for an album detail page. */
export const albumPath = (slug: string) => `/music/${slug}`;

