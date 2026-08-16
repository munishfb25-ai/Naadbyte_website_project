import type { BaseEntity, ImageRef } from "./common";
import type { PlatformKey } from "./platform";

/**
 * Artist / producer profile. Future-ready: no section renders this yet.
 */
export type Artist = BaseEntity & {
  name: string;
  role: string;
  bio: string;
  image?: ImageRef;
  socials?: { platform: PlatformKey; href: string }[];
  isFeatured?: boolean;
};
