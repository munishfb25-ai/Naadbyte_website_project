import type { ContentProvider } from "./content-provider";

/**
 * Wraps a remote provider (WordPress) and transparently falls back to the
 * local catalogue whenever a call fails, times out, or returns nothing.
 * The public website therefore keeps working if the CMS is unavailable.
 */
export function withFallback(primary: ContentProvider, fallback: ContentProvider): ContentProvider {
  const wrap = <K extends keyof ContentProvider>(key: K): ContentProvider[K] => {
    const primaryFn = primary[key];
    const fallbackFn = fallback[key];
    if (typeof primaryFn !== "function" || typeof fallbackFn !== "function") return fallbackFn;

    return (async (...args: unknown[]) => {
      try {
        const result = await (primaryFn as (...a: unknown[]) => Promise<unknown>).apply(
          primary,
          args,
        );
        if (result === undefined || (Array.isArray(result) && result.length === 0)) {
          return await (fallbackFn as (...a: unknown[]) => Promise<unknown>).apply(fallback, args);
        }
        return result;
      } catch (error) {
        console.warn(
          `[content] ${primary.name}.${String(key)} failed, using ${fallback.name}:`,
          error instanceof Error ? error.message : error,
        );
        return await (fallbackFn as (...a: unknown[]) => Promise<unknown>).apply(fallback, args);
      }
    }) as ContentProvider[K];
  };

  return {
    name: `${primary.name}+${fallback.name}`,
    getSongs: wrap("getSongs"),
    getSongBySlug: wrap("getSongBySlug"),
    getAlbums: wrap("getAlbums"),
    getAlbumBySlug: wrap("getAlbumBySlug"),
    getFeaturedReleases: wrap("getFeaturedReleases"),
    getGenres: wrap("getGenres"),
    getGenreBySlug: wrap("getGenreBySlug"),
    getVideos: wrap("getVideos"),
    getSocialPosts: wrap("getSocialPosts"),
    getPlatforms: wrap("getPlatforms"),
    getArtists: wrap("getArtists"),
    getTestimonials: wrap("getTestimonials"),
    getBlogPosts: wrap("getBlogPosts"),
    getBlogPostBySlug: wrap("getBlogPostBySlug"),
    getSongRequests: wrap("getSongRequests"),
    // Writes must not silently fall back to the mock store.
    submitSongRequest: primary.submitSongRequest.bind(primary),
  };
}
