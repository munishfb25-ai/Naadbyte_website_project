import type { BlogPost } from "@/types";

/** Future-ready: maps directly onto WordPress `posts`. */
export const blogPosts: BlogPost[] = [
  {
    id: "post-1",
    slug: "inside-shiva-within",
    title: "Inside 'Shiva Within': Building a Chant for Modern Speakers",
    excerpt:
      "How we layered temple recordings with orchestral textures without losing the stillness at the centre of the track.",
    publishedAt: "2026-01-18",
    categories: ["Behind the Music"],
    tags: ["devotional", "production"],
    readingMinutes: 6,
    status: "published",
  },
  {
    id: "post-2",
    slug: "neon-mantra-studio-notes",
    title: "Neon Mantra: Studio Notes from a Progressive House Session",
    excerpt:
      "A breakdown of the sound design, tempo choices and vocal chops behind our late-night club record.",
    publishedAt: "2025-11-02",
    categories: ["Studio Notes"],
    tags: ["edm", "progressive house"],
    readingMinutes: 5,
    status: "published",
  },
];
