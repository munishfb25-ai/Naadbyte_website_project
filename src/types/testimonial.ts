import type { BaseEntity, ImageRef } from "./common";

/**
 * Listener / client testimonial. Future-ready: no section renders this yet.
 */
export type Testimonial = BaseEntity & {
  author: string;
  role?: string;
  quote: string;
  avatar?: ImageRef;
  /** 1-5, optional star rating. */
  rating?: number;
  order?: number;
};
