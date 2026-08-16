import type { SocialPost } from "@/types";

/**
 * Short-form social / Reel content. Editor-managed; maps to a
 * `social_post` custom post type in WordPress.
 */
export const socialPosts: SocialPost[] = [
  {
    id: "social-1",
    slug: "shiva-within-reel",
    title: "Shiva Within — studio moment",
    network: "instagram",
    url: "https://www.instagram.com/",
    caption: "The chant that opens the record, tracked live at 5am.",
    publishedAt: "2026-01-14",
    order: 1,
    isFeatured: true,
    featuredOrder: 1,
    status: "published",
  },
  {
    id: "social-2",
    slug: "neon-mantra-reel",
    title: "Neon Mantra — drop preview",
    network: "instagram",
    url: "https://www.instagram.com/",
    caption: "Ancient mantra, modern low end.",
    publishedAt: "2025-09-21",
    order: 2,
    isFeatured: true,
    featuredOrder: 2,
    status: "published",
  },
];
