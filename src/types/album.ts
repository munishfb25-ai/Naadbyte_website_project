import type { BaseEntity, ID, ImageRef } from "./common";
import type { StreamingLink } from "./platform";

/** Album / EP / single release. Maps to an `album` custom post type. */
export type Album = BaseEntity & {
  title: string;
  /** Human-readable primary genre label shown on the card. */
  genre: string;
  /** References `Genre.id` for filtering. */
  genreIds: ID[];
  artistIds: ID[];
  /** Display year, e.g. "2026". */
  year: string;
  releaseDate?: string;
  cover: ImageRef;
  description: string;
  /** References `Song.id`, ordered as on the record. */
  songIds: ID[];
  streamingLinks: StreamingLink[];
  isFeatured?: boolean;
  /** Editor-controlled homepage ordering; lower renders first. */
  featuredOrder?: number;
};

/**
 * A curated homepage entry pointing at an album.
 * Kept separate from `Album` so editors can order/annotate features in the CMS
 * without touching the catalogue itself.
 */
export type FeaturedRelease = {
  id: ID;
  albumId: ID;
  /** Lower numbers render first. */
  order: number;
  badge?: string;
};
