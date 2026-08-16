import type { BaseEntity, ID, ISODate, ImageRef } from "./common";

/**
 * Editorial article. Future-ready: maps directly onto a WordPress `post`.
 */
export type BlogPost = BaseEntity & {
  title: string;
  excerpt: string;
  /** HTML or markdown body, depending on the CMS adapter. */
  content?: string;
  coverImage?: ImageRef;
  authorId?: ID;
  categories?: string[];
  tags?: string[];
  publishedAt: ISODate;
  readingMinutes?: number;
};
