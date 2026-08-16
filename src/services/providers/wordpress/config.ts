/**
 * WordPress integration configuration.
 *
 * Only the public REST base URL is exposed to the browser (`VITE_*`).
 * Admin credentials / application passwords must NEVER be placed here —
 * write operations belong in a server function reading `process.env`.
 */

export type WordPressConfig = {
  /** e.g. https://cms.naadbyte.com/wp-json */
  baseUrl: string;
  /** REST namespace holding the custom post types. */
  namespace: string;
  /** Fetch timeout in ms — keeps the site responsive if the CMS is down. */
  timeoutMs: number;
  /** Items requested per collection call. */
  perPage: number;
};

const env = import.meta.env as Record<string, string | undefined>;

export const wordpressConfig: WordPressConfig = {
  baseUrl: (env["VITE_WORDPRESS_API_URL"] ?? "").replace(/\/$/, ""),
  namespace: env["VITE_WORDPRESS_NAMESPACE"] ?? "wp/v2",
  timeoutMs: Number(env["VITE_WORDPRESS_TIMEOUT_MS"] ?? 6000),
  perPage: Number(env["VITE_WORDPRESS_PER_PAGE"] ?? 100),
};

/** True when a valid WordPress base URL has been configured. */
export const isWordPressConfigured = () =>
  Boolean(wordpressConfig.baseUrl && /^https?:\/\//i.test(wordpressConfig.baseUrl));

/**
 * Which provider the site should use.
 * `auto` (default) = WordPress when configured, local otherwise.
 */
export const contentProviderMode = (env["VITE_CONTENT_PROVIDER"] ?? "auto") as
  "auto" | "local" | "wordpress";

/** Custom post type / taxonomy slugs used by the NaadByte CMS. */
export const wordpressEndpoints = {
  song: "song",
  album: "album",
  genre: "genre",
  video: "video",
  socialPost: "social_post",
  blogPost: "posts",
  artist: "artist",
  testimonial: "testimonial",
  songRequest: "song_request",
} as const;

export async function wpFetch<T>(path: string, params: Record<string, string | number> = {}) {
  if (!isWordPressConfigured()) {
    throw new Error("WordPress API base URL is not configured or invalid.");
  }
  const url = new URL(`${wordpressConfig.baseUrl}/${wordpressConfig.namespace}/${path}`);
  url.searchParams.set("per_page", String(wordpressConfig.perPage));
  url.searchParams.set("_embed", "1");
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), wordpressConfig.timeoutMs);
  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`WordPress request failed [${response.status}]: ${await response.text()}`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}
