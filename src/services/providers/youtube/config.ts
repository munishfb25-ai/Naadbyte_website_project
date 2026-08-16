/**
 * YouTube Provider Configuration
 *
 * YouTube is the single source of truth for all videos on the platform.
 * Supports YouTube Data API v3 as primary, with automatic RSS feed & local catalogue fallbacks.
 */

export const youtubeConfig = {
  /**
   * YouTube Data API v3 Key.
   * If provided, allows fetching up to 50 items with rich metadata and highest resolution thumbnails.
   */
  get apiKey(): string | undefined {
    // Client-side Vite environment
    if (typeof import.meta !== "undefined" && import.meta.env?.["VITE_YOUTUBE_API_KEY"]) {
      return import.meta.env["VITE_YOUTUBE_API_KEY"];
    }
    // Server-side Node environment
    if (typeof process !== "undefined" && process.env?.["YOUTUBE_API_KEY"]) {
      return process.env["YOUTUBE_API_KEY"];
    }
    if (typeof process !== "undefined" && process.env?.["VITE_YOUTUBE_API_KEY"]) {
      return process.env["VITE_YOUTUBE_API_KEY"];
    }
    return "AIzaSyA3y-dhCpBeQScO-pSqYKtaofDeYfoOSFw";
  },

  /**
   * YouTube Channel ID (e.g. UCxxxxxxxxxxxxxxxxxxxxxx).
   * Used to query the channel's uploads playlist and RSS feed.
   */
  get channelId(): string {
    if (typeof import.meta !== "undefined" && import.meta.env?.["VITE_YOUTUBE_CHANNEL_ID"]) {
      return import.meta.env["VITE_YOUTUBE_CHANNEL_ID"];
    }
    if (typeof process !== "undefined" && process.env?.["YOUTUBE_CHANNEL_ID"]) {
      return process.env["YOUTUBE_CHANNEL_ID"];
    }
    if (typeof process !== "undefined" && process.env?.["VITE_YOUTUBE_CHANNEL_ID"]) {
      return process.env["VITE_YOUTUBE_CHANNEL_ID"];
    }
    // Default NaadByte Topic channel (DistroKid distribution)
    return "UC8vd9SmnjPxZwFCmCn3fWYw";
  },

  /**
   * Cache duration in milliseconds (15 minutes).
   * Prevents rate limits and optimizes performance.
   */
  cacheTtlMs: 15 * 60 * 1000,

  /**
   * YouTube Releases Playlist ID (for official music releases & audio tracks).
   */
  get releasesPlaylistId(): string | undefined {
    if (
      typeof import.meta !== "undefined" &&
      import.meta.env?.["VITE_YOUTUBE_RELEASES_PLAYLIST_ID"]
    ) {
      return import.meta.env["VITE_YOUTUBE_RELEASES_PLAYLIST_ID"];
    }
    if (typeof process !== "undefined" && process.env?.["YOUTUBE_RELEASES_PLAYLIST_ID"]) {
      return process.env["YOUTUBE_RELEASES_PLAYLIST_ID"];
    }
    return undefined;
  },

  maxResults: 12,
};

/** Checks if YouTube API key is available. */
export function isYouTubeApiConfigured(): boolean {
  return Boolean(youtubeConfig.apiKey);
}
