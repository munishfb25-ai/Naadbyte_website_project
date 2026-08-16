import type { BaseEntity, ImageRef, ISODate } from "./common";

/** Where a short-form social post lives. */
export type SocialNetwork = "instagram" | "youtube" | "facebook";

/**
 * Short-form social / Reel content curated by an editor.
 * Maps to a `social_post` custom post type in WordPress.
 */
export type SocialPost = BaseEntity & {
  title: string;
  network: SocialNetwork;
  /** Permalink to the reel / post on the network. */
  url: string;
  thumbnail?: ImageRef;
  caption?: string;
  publishedAt?: ISODate;
  order?: number;
  isFeatured?: boolean;
  /** Editor-controlled homepage ordering; lower renders first. */
  featuredOrder?: number;
};
