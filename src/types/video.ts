import type { BaseEntity, ID, ISODate } from "./common";

export type VideoProvider = "youtube" | "vimeo" | "self-hosted";

/** A music video, visualizer or live session. */
export type Video = BaseEntity & {
  title: string;
  description: string;
  provider: VideoProvider;
  /** Provider-side id (YouTube video id) or full URL for self-hosted. */
  videoId: string;
  thumbnail?: string | undefined;
  publishedAt?: ISODate;
  /** References `Song.id` / `Album.id` when the video belongs to a release. */
  songId?: ID;
  albumId?: ID;
  /** References `Genre.id` — category shown on video listings. */
  genreIds?: ID[];
  order?: number;
  isFeatured?: boolean;
  /** Editor-controlled homepage ordering; lower renders first. */
  featuredOrder?: number;
  duration?: string;
  year?: string;
  genreStr?: string;
  category?: string;
};
