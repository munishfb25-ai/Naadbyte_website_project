import type { AnyRouteMatch } from "@tanstack/react-router";

/**
 * Builds a consistent head() meta block for a page.
 * Central so title/OG conventions change in one place.
 */
export function pageMeta({
  title,
  description,
  noindex,
}: {
  title: string;
  description: string;
  noindex?: boolean;
}): NonNullable<AnyRouteMatch["meta"]> {
  const meta = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
  return noindex ? [...meta, { name: "robots", content: "noindex" }] : meta;
}

/** Suffixes a page title with the brand name. */
export const withBrand = (title: string) => `${title} — NaadByte`;
