import type { BaseEntity, ImageRef } from "./common";

/** A musical category surfaced in the genre grid. */
export type Genre = BaseEntity & {
  name: string;
  description: string;
  image: ImageRef;
  /** Where the card links to (anchor today, route once pages exist). */
  href: string;
  /** Lower numbers render first. */
  order?: number;
  isFeatured?: boolean;
};
