import type { ID } from "./common";

/** Every streaming/social destination the label publishes to. */
export type PlatformKey =
  "spotify" | "appleMusic" | "youtubeMusic" | "amazonMusic" | "instagram" | "facebook" | "youtube";

export type PlatformKind = "streaming" | "social";

/** A platform profile (label-level link). */
export type Platform = {
  id: ID;
  key: PlatformKey;
  name: string;
  href: string;
  kind: PlatformKind;
  order?: number;
};

/** A per-release link to a specific platform. */
export type StreamingLink = {
  platform: PlatformKey;
  href: string;
};
