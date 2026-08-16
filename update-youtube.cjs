const fs = require("fs");

let content = fs.readFileSync("src/services/providers/youtube/youtube-content-provider.ts", "utf8");

// Replace cachedVideos
content = content.replace(
  "let cachedVideos: Video[] | null = null;\nlet lastFetchedAt = 0;",
  `type CacheEntry = { videos: Video[]; nextPageToken?: string; timestamp: number };
let pageCache = new Map<string, CacheEntry>();`,
);

// Replace fetchFromApi
content = content.replace(
  /async fetchFromApi\(\): Promise<Video\[\]> \{[\s\S]*?return data.items.map\(\(item, index\) => mapYouTubeApiItem\(item, index\)\);\n  \},/,
  `async fetchFromApi(pageToken?: string): Promise<{ videos: Video[]; nextPageToken?: string; totalResults: number }> {
    const apiKey = youtubeConfig.apiKey;
    const channelId = youtubeConfig.channelId;

    if (!apiKey) {
      throw new Error("YouTube API key is not configured.");
    }

    const playlistId = channelId.startsWith("UC") ? \`UU\${channelId.slice(2)}\` : channelId;
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
      throw new Error(\`YouTube API request failed with status \${res.status}: \${errText}\`);
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
          const headRes = await fetch(\`https://www.youtube.com/shorts/\${video.videoId}\`, {
            method: "HEAD",
            redirect: "manual",
          });
          if (headRes.status === 303) {
            longFormEntries.push(video);
          }
        } catch (e) {
          longFormEntries.push(video);
        }
      })
    );
    
    const originalOrderIds = parsedItems.map(v => v.videoId);
    longFormEntries.sort((a, b) => originalOrderIds.indexOf(a.videoId) - originalOrderIds.indexOf(b.videoId));
    
    console.log(\`[YouTube API] Fetched page. Filtered videos: \${parsedItems.length} total -> \${longFormEntries.length} long-form only.\`);
    
    return { 
      videos: longFormEntries, 
      nextPageToken: data.nextPageToken,
      totalResults: data.pageInfo?.totalResults ?? 0
    };
  },`,
);

// Replace getVideos
content = content.replace(
  /async getVideos\(\): Promise<Video\[\]> \{[\s\S]*?return localVideos;\n  \},/,
  `async getVideos(pageToken?: string): Promise<{ videos: Video[]; nextPageToken?: string; totalResults: number }> {
    const now = Date.now();
    const cacheKey = pageToken || "first_page";

    const cached = pageCache.get(cacheKey);
    if (cached && now - cached.timestamp < youtubeConfig.cacheTtlMs) {
      return { videos: cached.videos, nextPageToken: cached.nextPageToken, totalResults: 0 };
    }

    try {
      if (isYouTubeApiConfigured()) {
        const result = await this.fetchFromApi(pageToken);
        pageCache.set(cacheKey, { videos: result.videos, nextPageToken: result.nextPageToken, timestamp: now });
        return result;
      }
    } catch (err) {
      console.error(
        "API_FETCH_ERROR:",
        "[youtube-provider] YouTube API fetch failed, falling back to local catalogue:",
        err,
      );
    }

    const localData = await localContentProvider.getVideos(pageToken);
    return { videos: localData.videos, nextPageToken: localData.nextPageToken, totalResults: localData.videos.length };
  },`,
);

// Replace invalidateCache
content = content.replace(
  /invalidateCache\(\): void \{[\s\S]*?\},/,
  `invalidateCache(): void {
    pageCache.clear();
  },`,
);

fs.writeFileSync("src/services/providers/youtube/youtube-content-provider.ts", content);
console.log("updated");
