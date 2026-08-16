import type { BaseEntity, ID, ImageRef, Language, ISODate } from "./common";
import type { StreamingLink } from "./platform";

/** A single track. Maps 1:1 to a `song` custom post type in WordPress. */
export type Song = BaseEntity & {
  title: string;
  /** Primary artist(s) — references `Artist.id`. */
  artistIds: ID[];
  /** Album this song belongs to, if any — references `Album.id`. */
  albumId?: ID;
  /** References `Genre.id`. */
  genreIds: ID[];
  language: Language;
  /** Duration in seconds; formatted at render time. */
  durationSeconds: number;
  releaseDate: ISODate;
  cover: ImageRef;
  /** Optional preview/stream URL for an in-app player. */
  audioUrl?: string;
  streamingLinks: StreamingLink[];
  description?: string;
  story?: string;
  mood?: string;
  suitableFor?: string;
  productionNotes?: string;
  tempo?: string;
  bpm?: number;
  aiNotes?: string;
  lyrics?: string;
  tags?: string[];
  isFeatured?: boolean;
  /** Editor-controlled homepage ordering; lower renders first. */
  featuredOrder?: number;
};
