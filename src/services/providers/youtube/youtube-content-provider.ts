import type { Video } from "@/types";
import { localContentProvider } from "../local-content-provider";
import { isYouTubeApiConfigured, youtubeConfig } from "./config";
import {
  mapYouTubeApiItem,
  mapYouTubeRssEntry,
  type YouTubeApiPlaylistItem,
  type YouTubeRssEntry,
} from "./mappers";

/**
 * In-memory cache to prevent excessive API requests and avoid rate limits.
 */
type CacheEntry = { videos: Video[]; nextPageToken?: string | undefined; timestamp: number };
const pageCache = new Map<string, CacheEntry>();

/**
 * Parses YouTube's Atom XML RSS feed using a resilient regex approach
 * that works identically in browser, SSR Node.js, and edge environments without extra dependencies.
 */
export function parseYouTubeRss(xmlText: string): YouTubeRssEntry[] {
  const entries: YouTubeRssEntry[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match: RegExpExecArray | null;

  while ((match = entryRegex.exec(xmlText)) !== null) {
    const block = match[1];
    if (!block) continue;

    const videoIdMatch =
      block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || block.match(/<id>yt:video:([^<]+)<\/id>/);
    const titleMatch = block.match(/<title>([^<]+)<\/title>/);
    const descMatch = block.match(/<media:description>([\s\S]*?)<\/media:description>/);
    const pubMatch = block.match(/<published>([^<]+)<\/published>/);
    const thumbMatch = block.match(/<media:thumbnail[^>]+url="([^"]+)"/);
    const linkMatch = block.match(/<link rel="alternate" href="([^"]+)"\/>/);

    if (videoIdMatch && videoIdMatch[1]) {
      const videoId = videoIdMatch[1].trim();
      const title = titleMatch?.[1]?.trim() || `Video ${videoId}`;
      const description = descMatch?.[1]?.trim() || "";
      const publishedAt = pubMatch?.[1]?.trim() || new Date().toISOString();
      const thumbnailUrl = thumbMatch?.[1]?.trim();

      const linkUrl = linkMatch?.[1] || "";
      const isShortUrl = linkUrl.includes("/shorts/");

      entries.push({
        videoId,
        title,
        description,
        publishedAt,
        thumbnailUrl,
        isShortUrl,
      });
    }
  }

  return entries;
}

/**
 * YouTube Provider
 *
 * Single source of truth for all video content.
 * Follows an orderly resilience hierarchy:
 * 1. Cache (15 min TTL)
 * 2. YouTube Data API v3 (if API key is present)
 * 3. YouTube Public RSS Feed (zero-auth public fallback)
 * 4. Local Catalogue (offline/build-time safety net)
 */
export const youtubeContentProvider = {
  name: "youtube",

  /**
   * Fetches videos directly from YouTube Data API v3.
   */
  async fetchFromApi(
    pageToken?: string | undefined,
  ): Promise<{ videos: Video[]; nextPageToken?: string | undefined; totalResults: number }> {
    const apiKey = youtubeConfig.apiKey;
    const channelId = youtubeConfig.channelId;

    if (!apiKey) {
      throw new Error("YouTube API key is not configured.");
    }

    const playlistId =
      youtubeConfig.releasesPlaylistId ||
      (channelId.startsWith("UC") ? `UU${channelId.slice(2)}` : channelId);
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    url.searchParams.set("part", "snippet,contentDetails");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("maxResults", String(youtubeConfig.maxResults));
    url.searchParams.set("key", apiKey);
    if (pageToken) {
      url.searchParams.set("pageToken", pageToken);
    }

    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`YouTube API request failed with status ${res.status}: ${errText}`);
    }

    const data = (await res.json()) as {
      items?: YouTubeApiPlaylistItem[];
      nextPageToken?: string;
      pageInfo?: { totalResults: number };
    };

    if (!data.items || data.items.length === 0) {
      return { videos: [], totalResults: 0 };
    }

    const longFormEntries: Video[] = [];
    const parsedItems = data.items.map((item, index) => mapYouTubeApiItem(item, index));

    await Promise.all(
      parsedItems.map(async (video) => {
        try {
          const headRes = await fetch(`https://www.youtube.com/shorts/${video.videoId}`, {
            method: "HEAD",
            redirect: "manual",
          });
          if (headRes.status === 303) {
            longFormEntries.push(video);
          }
        } catch (e) {
          longFormEntries.push(video);
        }
      }),
    );

    const originalOrderIds = parsedItems.map((v) => v.videoId);
    longFormEntries.sort(
      (a, b) => originalOrderIds.indexOf(a.videoId) - originalOrderIds.indexOf(b.videoId),
    );

    console.log(
      `[YouTube API] Fetched page. Filtered videos: ${parsedItems.length} total -> ${longFormEntries.length} long-form only.`,
    );

    return {
      videos: longFormEntries,
      nextPageToken: data.nextPageToken,
      totalResults: data.pageInfo?.totalResults ?? 0,
    };
  },

  /**
   * Fetches videos from the YouTube Channel RSS Feed without requiring an API key.
   */
  async fetchFromRss(): Promise<Video[]> {
    const channelId = youtubeConfig.channelId;
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

    const res = await fetch(rssUrl, {
      headers: {
        Accept: "application/atom+xml, application/xml, text/xml",
      },
    });
    if (!res.ok) {
      throw new Error(`YouTube RSS request failed with status ${res.status}`);
    }

    const xml = await res.text();
    const parsedEntries = parseYouTubeRss(xml);

    if (parsedEntries.length === 0) {
      return [];
    }

    return parsedEntries.map((entry, index) => mapYouTubeRssEntry(entry, index));
  },

  /**
   * Retrieves all channel videos with automatic multi-tier fallback and caching.
   */
  async getVideos(
    pageToken?: string | undefined,
  ): Promise<{ videos: Video[]; nextPageToken?: string | undefined; totalResults: number }> {
    const now = Date.now();
    const cacheKey = pageToken || "first_page";

    const cached = pageCache.get(cacheKey);
    if (cached && now - cached.timestamp < youtubeConfig.cacheTtlMs) {
      return {
        videos: cached.videos,
        nextPageToken: cached.nextPageToken,
        totalResults: cached.videos.length,
      };
    }

    // 1. Try YouTube Data API v3 if API key is provided
    if (isYouTubeApiConfigured()) {
      try {
        const result = await this.fetchFromApi(pageToken);
        if (result.videos.length > 0) {
          pageCache.set(cacheKey, {
            videos: result.videos,
            nextPageToken: result.nextPageToken,
            timestamp: now,
          });
          return result;
        }
      } catch (err) {
        console.warn("[youtube-provider] YouTube Data API failed, falling back to RSS feed:", err);
      }
    }

    // 2. Try YouTube Public Channel RSS Feed (zero-auth, live channel uploads)
    try {
      const rssVideos = await this.fetchFromRss();
      if (rssVideos.length > 0) {
        pageCache.set(cacheKey, {
          videos: rssVideos,
          nextPageToken: undefined,
          timestamp: now,
        });
        return {
          videos: rssVideos,
          nextPageToken: undefined,
          totalResults: rssVideos.length,
        };
      }
    } catch (err) {
      console.warn(
        "[youtube-provider] YouTube RSS fetch failed, falling back to local catalogue:",
        err,
      );
    }

    // 3. Local Catalogue safety net (offline fallback)
    const localData = await localContentProvider.getVideos(pageToken);
    return {
      videos: localData.videos,
      nextPageToken: localData.nextPageToken,
      totalResults: localData.videos.length,
    };
  },

  /**
   * Clears the in-memory cache to force a fresh fetch on next call.
   */
  invalidateCache(): void {
    pageCache.clear();
  },
};
