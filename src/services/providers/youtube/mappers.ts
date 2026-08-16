import type { Video } from "@/types";

/**
 * Classifies a YouTube video into appropriate website categories based on title & description.
 */
export function inferVideoCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes("#shorts") || text.includes("shorts") || text.includes("/shorts/")) {
    return "Shorts";
  }
  if (
    text.includes("official video") ||
    text.includes("music video") ||
    text.includes("official music video")
  ) {
    return "Official Videos";
  }
  if (
    text.includes("live") ||
    text.includes("session") ||
    text.includes("concert") ||
    text.includes("acoustic") ||
    text.includes("unplugged")
  ) {
    return "Live Sessions";
  }
  if (
    text.includes("visualizer") ||
    text.includes("visualiser") ||
    text.includes("animation") ||
    text.includes("motion")
  ) {
    return "Visualizers";
  }
  if (text.includes("lyric") || text.includes("lyrics") || text.includes("lyrical")) {
    return "Lyrics";
  }
  if (
    text.includes("behind the scenes") ||
    text.includes("bts") ||
    text.includes("making of") ||
    text.includes("vlog") ||
    text.includes("studio session")
  ) {
    return "Behind The Scenes";
  }
  if (
    text.includes("trailer") ||
    text.includes("teaser") ||
    text.includes("promo") ||
    text.includes("announcement")
  ) {
    return "Trailers";
  }

  return "Official Videos";
}

/**
 * Infers musical genre / style tag from title and description.
 */
export function inferVideoGenre(title: string, description: string): string | undefined {
  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes("devotional") ||
    text.includes("shiva") ||
    text.includes("mantra") ||
    text.includes("bhajan") ||
    text.includes("aarti") ||
    text.includes("krishna")
  ) {
    return "Devotional";
  }
  if (
    text.includes("edm") ||
    text.includes("house") ||
    text.includes("trance") ||
    text.includes("electronic") ||
    text.includes("synth")
  ) {
    return "EDM";
  }
  if (
    text.includes("motivational") ||
    text.includes("anthem") ||
    text.includes("rise") ||
    text.includes("power") ||
    text.includes("goat")
  ) {
    return "Motivational";
  }
  if (
    text.includes("cinematic") ||
    text.includes("soundtrack") ||
    text.includes("score") ||
    text.includes("orchestra")
  ) {
    return "Cinematic";
  }
  if (
    text.includes("romantic") ||
    text.includes("love") ||
    text.includes("aashiqui") ||
    text.includes("kasam")
  ) {
    return "Romantic";
  }
  if (text.includes("punjabi") || text.includes("dhol") || text.includes("bhangra")) {
    return "Punjabi";
  }
  if (
    text.includes("ambient") ||
    text.includes("meditation") ||
    text.includes("lo-fi") ||
    text.includes("chill")
  ) {
    return "Ambient";
  }
  if (
    text.includes("instrumental") ||
    text.includes("flute") ||
    text.includes("sitar") ||
    text.includes("piano")
  ) {
    return "Instrumental";
  }
  return undefined;
}

/**
 * Converts text to a clean URL slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Raw item structure from YouTube Data API v3 playlistItems or search.
 */
export type YouTubeApiPlaylistItem = {
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
      standard?: { url: string };
      maxres?: { url: string };
    };
    resourceId?: {
      videoId: string;
    };
  };
  contentDetails?: {
    videoId?: string;
  };
};

/**
 * Maps a YouTube Data API v3 item to our standard `Video` domain model.
 */
export function mapYouTubeApiItem(item: YouTubeApiPlaylistItem, index: number): Video {
  const videoId = item.contentDetails?.videoId || item.snippet.resourceId?.videoId || item.id;

  const title = item.snippet.title ?? "";
  const description = item.snippet.description ?? "";
  const publishedAt = item.snippet.publishedAt;
  const year = publishedAt ? publishedAt.slice(0, 4) : undefined;

  const thumbs = item.snippet.thumbnails;
  const thumbnail =
    thumbs?.maxres?.url ||
    thumbs?.standard?.url ||
    thumbs?.high?.url ||
    thumbs?.medium?.url ||
    thumbs?.default?.url ||
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const category = inferVideoCategory(title, description);
  const genreStr = inferVideoGenre(title, description);
  const slug = slugify(title) || `video-${videoId}`;

  return {
    id: `yt-${videoId}`,
    slug,
    title,
    description,
    provider: "youtube",
    videoId,
    thumbnail,
    publishedAt,
    status: "published",
    isFeatured: index === 0,
    featuredOrder: index + 1,
    order: index + 1,
    ...(year ? { year } : {}),
    ...(genreStr ? { genreStr } : {}),
    category,
  };
}

/**
 * Maps an RSS Feed parsed entry to our standard `Video` domain model.
 */
export type YouTubeRssEntry = {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl?: string | undefined;
  isShortUrl: boolean;
};

export function mapYouTubeRssEntry(entry: YouTubeRssEntry, index: number): Video {
  const videoId = entry.videoId;
  const title = entry.title;
  const description = entry.description;
  const publishedAt = entry.publishedAt;
  const year = publishedAt ? publishedAt.slice(0, 4) : undefined;
  const thumbnail = entry.thumbnailUrl || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const category = entry.isShortUrl ? "Shorts" : inferVideoCategory(title, description);
  const genreStr = inferVideoGenre(title, description);
  const slug = slugify(title) || `video-${videoId}`;

  const result: Video = {
    id: `yt-${videoId}`,
    slug,
    title,
    description,
    provider: "youtube",
    videoId,
    thumbnail,
    publishedAt,
    status: "published",
    isFeatured: index === 0,
    featuredOrder: index + 1,
    order: index + 1,
    category,
  };
  if (year) result.year = year;
  if (genreStr) result.genreStr = genreStr;
  return result;
}
