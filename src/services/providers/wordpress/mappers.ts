import type {
  Album,
  Artist,
  BlogPost,
  FeaturedRelease,
  Genre,
  ImageRef,
  Language,
  PlatformKey,
  PublishStatus,
  SocialPost,
  Song,
  StreamingLink,
  Testimonial,
  Video,
} from "@/types";

/**
 * Mapping layer: WordPress REST payloads -> NaadByte domain models.
 *
 * Every mapper is defensive — a missing ACF field must never throw, because
 * the public site has to keep rendering whatever the CMS does return.
 */

export type WpPost = {
  id: number;
  slug: string;
  status?: string;
  date?: string;
  modified?: string;
  title?: { rendered?: string };
  content?: { rendered?: string };
  excerpt?: { rendered?: string };
  acf?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  _embedded?: { "wp:featuredmedia"?: { source_url?: string; alt_text?: string }[] };
};

const fields = (post: WpPost): Record<string, unknown> => ({ ...post.meta, ...post.acf });

const str = (value: unknown, fallback = ""): string =>
  typeof value === "string" && value.trim() !== ""
    ? value
    : typeof value === "number"
      ? String(value)
      : fallback;

const num = (value: unknown): number | undefined => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const bool = (value: unknown): boolean =>
  value === true || value === 1 || value === "1" || value === "true";

const list = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map((item) => str(item)).filter(Boolean);
  if (typeof value === "string" && value.trim()) return value.split(",").map((s) => s.trim());
  return [];
};

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

export const mapStatus = (post: WpPost): PublishStatus =>
  post.status === "publish" || post.status === undefined ? "published" : "draft";

export function mapImage(post: WpPost, altFallback: string, field = "artwork"): ImageRef {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const custom = str(fields(post)[field]);
  return {
    src: custom || media?.source_url || "",
    alt: media?.alt_text || altFallback,
  };
}

function mapStreamingLinks(data: Record<string, unknown>): StreamingLink[] {
  const map: Record<string, PlatformKey> = {
    spotify_url: "spotify",
    apple_music_url: "appleMusic",
    youtube_music_url: "youtubeMusic",
    amazon_music_url: "amazonMusic",
    youtube_url: "youtube",
  };
  return Object.entries(map)
    .map(([field, platform]) => ({ platform, href: str(data[field]) }))
    .filter((link) => link.href.length > 0);
}

export function mapSong(post: WpPost): Song {
  const data = fields(post);
  const title = stripHtml(str(post.title?.rendered, post.slug));
  const audioUrl = str(data["audio_url"] ?? data["mp3_url"]);
  const featuredOrder = num(data["featured_order"]);
  return {
    id: str(data["external_id"], `wp-song-${post.id}`),
    slug: post.slug,
    title,
    artistIds: list(data["artist_ids"] ?? data["artists"]),
    genreIds: list(data["genre_ids"] ?? data["genres"]),
    language: (str(data["language"], "hindi") as Language) ?? "hindi",
    durationSeconds: num(data["duration_seconds"]) ?? 0,
    releaseDate: str(data["release_date"], (post.date ?? "").slice(0, 10)),
    cover: mapImage(post, `${title} cover`, "cover"),
    streamingLinks: mapStreamingLinks(data),
    status: mapStatus(post),
    isFeatured: bool(data["featured"]),
    ...(str(data["album_id"]) ? { albumId: str(data["album_id"]) } : {}),
    ...(audioUrl ? { audioUrl } : {}),
    ...(str(data["description"]) || str(post.content?.rendered) || str(post.excerpt?.rendered)
      ? {
          description: stripHtml(
            str(data["description"]) || str(post.content?.rendered) || str(post.excerpt?.rendered),
          ),
        }
      : {}),
    ...(str(data["story"]) ? { story: str(data["story"]) } : {}),
    ...(str(data["mood"]) ? { mood: str(data["mood"]) } : {}),
    ...(str(data["suitable_for"]) ? { suitableFor: str(data["suitable_for"]) } : {}),
    ...(str(data["production_notes"]) ? { productionNotes: str(data["production_notes"]) } : {}),
    ...(str(data["tempo"]) ? { tempo: str(data["tempo"]) } : {}),
    ...(num(data["bpm"]) !== undefined ? { bpm: num(data["bpm"]) } : {}),
    ...(str(data["ai_notes"]) ? { aiNotes: str(data["ai_notes"]) } : {}),
    ...(str(data["lyrics"]) ? { lyrics: str(data["lyrics"]) } : {}),
    ...(featuredOrder !== undefined ? { featuredOrder } : {}),
  };
}

export function mapAlbum(post: WpPost): Album {
  const data = fields(post);
  const title = stripHtml(str(post.title?.rendered, post.slug));
  const releaseDate = str(data["release_date"], (post.date ?? "").slice(0, 10));
  const featuredOrder = num(data["featured_order"]);
  return {
    id: str(data["external_id"], `wp-album-${post.id}`),
    slug: post.slug,
    title,
    genre: str(data["genre"]),
    genreIds: list(data["genre_ids"] ?? data["genres"]),
    artistIds: list(data["artist_ids"] ?? data["artists"]),
    year: releaseDate.slice(0, 4),
    releaseDate,
    cover: mapImage(post, `${title} album cover`, "artwork"),
    description: stripHtml(str(post.content?.rendered ?? post.excerpt?.rendered)),
    songIds: list(data["song_ids"] ?? data["songs"]),
    streamingLinks: mapStreamingLinks(data),
    status: mapStatus(post),
    isFeatured: bool(data["featured"]),
    ...(featuredOrder !== undefined ? { featuredOrder } : {}),
  };
}

export function mapFeaturedRelease(album: Album, fallbackOrder: number): FeaturedRelease {
  return { id: `fr-${album.id}`, albumId: album.id, order: album.featuredOrder ?? fallbackOrder };
}

export function mapGenre(post: WpPost, href: string): Genre {
  const data = fields(post);
  const name = stripHtml(str(post.title?.rendered, post.slug));
  const order = num(data["order"]);
  return {
    id: str(data["external_id"], post.slug),
    slug: post.slug,
    name,
    description: stripHtml(str(post.excerpt?.rendered ?? post.content?.rendered)),
    image: mapImage(post, `${name} artwork`, "artwork"),
    href,
    status: mapStatus(post),
    isFeatured: bool(data["featured"]),
    ...(order !== undefined ? { order } : {}),
  };
}

/** Accepts a full YouTube URL or a bare video id. */
export function youtubeVideoId(input: string): string {
  const match = input.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return match?.[1] ?? input;
}

export function mapVideo(post: WpPost): Video {
  const data = fields(post);
  const order = num(data["order"]);
  const featuredOrder = num(data["featured_order"]);
  const thumbnail = mapImage(post, "", "thumbnail").src;
  const duration = str(data["duration"]);
  const year = str(data["year"], (post.date ?? "").slice(0, 4));
  const genreStr = str(data["genre_str"] ?? data["genre"]);
  const category = str(data["category"] ?? data["video_category"]);

  return {
    id: str(data["external_id"], `wp-video-${post.id}`),
    slug: post.slug,
    title: stripHtml(str(post.title?.rendered, post.slug)),
    description: stripHtml(str(post.excerpt?.rendered ?? post.content?.rendered)),
    provider: "youtube",
    videoId: youtubeVideoId(str(data["youtube_url"] ?? data["video_id"])),
    genreIds: list(data["genre_ids"] ?? data["genres"]),
    publishedAt: str(data["published_date"], (post.date ?? "").slice(0, 10)),
    status: mapStatus(post),
    isFeatured: bool(data["featured"]),
    ...(thumbnail ? { thumbnail } : {}),
    ...(order !== undefined ? { order } : {}),
    ...(featuredOrder !== undefined ? { featuredOrder } : {}),
    ...(duration ? { duration } : {}),
    ...(year ? { year } : {}),
    ...(genreStr ? { genreStr } : {}),
    ...(category ? { category } : {}),
  };
}

export function mapSocialPost(post: WpPost): SocialPost {
  const data = fields(post);
  const title = stripHtml(str(post.title?.rendered, post.slug));
  const order = num(data["order"]);
  const thumbnail = mapImage(post, title, "thumbnail");
  return {
    id: str(data["external_id"], `wp-social-${post.id}`),
    slug: post.slug,
    title,
    network: (str(data["network"], "instagram") as SocialPost["network"]) ?? "instagram",
    url: str(data["instagram_url"] ?? data["url"]),
    publishedAt: str(data["published_date"], (post.date ?? "").slice(0, 10)),
    status: mapStatus(post),
    isFeatured: bool(data["featured"]),
    ...(thumbnail.src ? { thumbnail } : {}),
    ...(str(data["caption"]) ? { caption: str(data["caption"]) } : {}),
    ...(order !== undefined ? { order } : {}),
  };
}

export function mapBlogPost(post: WpPost): BlogPost {
  const data = fields(post);
  const cover = mapImage(post, "", "cover");
  const readingMinutes = num(data["reading_minutes"]);
  return {
    id: `wp-post-${post.id}`,
    slug: post.slug,
    title: stripHtml(str(post.title?.rendered, post.slug)),
    excerpt: stripHtml(str(post.excerpt?.rendered)),
    content: str(post.content?.rendered),
    publishedAt: (post.date ?? "").slice(0, 10),
    status: mapStatus(post),
    categories: list(data["categories_names"]),
    tags: list(data["tags_names"]),
    ...(cover.src ? { coverImage: cover } : {}),
    ...(readingMinutes !== undefined ? { readingMinutes } : {}),
  };
}

export function mapArtist(post: WpPost): Artist {
  const data = fields(post);
  const name = stripHtml(str(post.title?.rendered, post.slug));
  const image = mapImage(post, name, "photo");
  return {
    id: str(data["external_id"], `wp-artist-${post.id}`),
    slug: post.slug,
    name,
    role: str(data["role"]),
    bio: stripHtml(str(post.content?.rendered)),
    status: mapStatus(post),
    ...(image.src ? { image } : {}),
  };
}

export function mapTestimonial(post: WpPost): Testimonial {
  const data = fields(post);
  const order = num(data["order"]);
  const rating = num(data["rating"]);
  return {
    id: str(data["external_id"], `wp-testimonial-${post.id}`),
    slug: post.slug,
    author: str(data["author_name"], stripHtml(str(post.title?.rendered))),
    quote: stripHtml(str(post.content?.rendered)),
    status: mapStatus(post),
    ...(str(data["role"]) ? { role: str(data["role"]) } : {}),
    ...(order !== undefined ? { order } : {}),
    ...(rating !== undefined ? { rating } : {}),
  };
}
