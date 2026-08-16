/**
 * Shared primitive types used across every NaadByte content model.
 *
 * These types are intentionally CMS-agnostic: a WordPress / headless CMS
 * adapter only has to map its payload onto these shapes.
 */

/** Unique, stable identifier for any entity (CMS post id, uuid, slug…). */
export type ID = string;

/** URL-safe identifier used for routing and CMS lookups. */
export type Slug = string;

/** ISO-8601 date string, e.g. "2026-02-14". */
export type ISODate = string;

/** An image reference. `src` may be a bundled asset or a remote CMS URL. */
export type ImageRef = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

/** A link with a human label. `external` opens in a new tab. */
export type LinkRef = {
  label: string;
  href: string;
  external?: boolean;
};

/** Publication state, mirroring common CMS statuses. */
export type PublishStatus = "draft" | "published" | "scheduled" | "archived";

/** Languages the label publishes in. */
export type Language = "hindi" | "english" | "punjabi" | "instrumental";

/** Fields every CMS-backed entity carries. */
export type BaseEntity = {
  id: ID;
  slug: Slug;
  status?: PublishStatus;
  createdAt?: ISODate;
  updatedAt?: ISODate;
};

/** Generic paginated response shape returned by the content layer. */
export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  perPage: number;
};

/** Copy block shared by every homepage section. */
export type SectionContent = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};
