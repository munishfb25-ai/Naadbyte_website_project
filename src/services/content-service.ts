/**
 * Content service — the only module UI code should import data through.
 *
 * - `contentService`: async API, provider-swappable (local → WordPress/CMS).
 * - `select`: synchronous selectors over the bundled data, used by pages and
 *   homepage sections so rendering stays SSR-safe and animation-identical.
 *
 * Migrating to a CMS = implement `ContentProvider`, set it as the active
 * provider, and move sections from `select` to `contentService` inside a
 * route loader + TanStack Query. No component markup changes.
 */

import { albums, featuredReleases } from "@/data/albums";
import { artists } from "@/data/artists";
import { blogPosts } from "@/data/blog";
import { genres } from "@/data/genres";
import { listenEverywhereKeys, platformDirectory, socialKeys } from "@/data/platforms";
import { socialPosts } from "@/data/social-posts";
import { songs } from "@/data/songs";
import { testimonials } from "@/data/testimonials";
import { videos } from "@/data/videos";
import type {
  Album,
  Artist,
  BlogPost,
  Genre,
  Platform,
  PlatformKey,
  SocialPost,
  Song,
  Testimonial,
  Video,
} from "@/types";
import type { ContentProvider } from "./providers/content-provider";
import { withFallback } from "./providers/fallback-content-provider";
import { localContentProvider } from "./providers/local-content-provider";
import { contentProviderMode, isWordPressConfigured } from "./providers/wordpress/config";
import { wordpressContentProvider } from "./providers/wordpress/wordpress-content-provider";
import { youtubeContentProvider } from "./providers/youtube";

/**
 * Active provider, chosen by environment configuration:
 *
 *   VITE_CONTENT_PROVIDER=local      -> bundled catalogue only
 *   VITE_CONTENT_PROVIDER=wordpress  -> WordPress (still falls back locally)
 *   VITE_CONTENT_PROVIDER=auto       -> WordPress when VITE_WORDPRESS_API_URL is set
 *
 * NOTE: YouTube is the dedicated single source of truth for all videos.
 * WordPress / Local providers handle audio, albums, genres, artists, and editorial content.
 */
function resolveProvider(): ContentProvider {
  const useWordPress =
    contentProviderMode === "wordpress" ||
    (contentProviderMode === "auto" && isWordPressConfigured());
  const base = !useWordPress
    ? localContentProvider
    : withFallback(wordpressContentProvider, localContentProvider);

  return {
    ...base,
    name: `${base.name}+youtube`,
    // YouTube provider is the single source of truth for all video content in the Videos section
    getVideos: (pageToken?: string) => youtubeContentProvider.getVideos(pageToken),
  };
}

export const contentService: ContentProvider = resolveProvider();

const byOrder = <T extends { order?: number }>(a: T, b: T) => (a.order ?? 0) - (b.order ?? 0);

const isPublished = <T extends { status?: string }>(entity: T) =>
  entity.status === undefined || entity.status === "published";

/** Optional `limit` used by homepage preview sections. */
const take = <T>(items: T[], limit?: number) =>
  typeof limit === "number" ? items.slice(0, limit) : items;

const platformByKey = (key: PlatformKey): Platform | undefined =>
  platformDirectory.find((p) => p.key === key);

/** Synchronous selectors over the bundled catalogue. */
export const select = {
  /** Albums, ordered by the editor-curated featured list. */
  featuredAlbums(limit?: number): Album[] {
    const list = [...featuredReleases]
      .sort(byOrder)
      .map((feature) => albums.find((album) => album.id === feature.albumId))
      .filter((album): album is Album => Boolean(album) && isPublished(album!));
    return take(list, limit);
  },

  albums(limit?: number): Album[] {
    return take(albums.filter(isPublished), limit);
  },

  albumBySlug(slug: string): Album | undefined {
    return albums.find((album) => album.slug === slug);
  },

  albumById(id: string): Album | undefined {
    return albums.find((album) => album.id === id);
  },

  songs(limit?: number): Song[] {
    return take(songs.filter(isPublished), limit);
  },

  songBySlug(slug: string): Song | undefined {
    return songs.find((song) => song.slug === slug);
  },

  songsByAlbum(albumId: string): Song[] {
    return songs.filter((song) => song.albumId === albumId);
  },

  songsByGenre(genreId: string): Song[] {
    return songs.filter((song) => isPublished(song) && song.genreIds.includes(genreId));
  },

  genres(limit?: number): Genre[] {
    return take(genres.filter(isPublished).sort(byOrder), limit);
  },

  genreById(id: string): Genre | undefined {
    return genres.find((genre) => genre.id === id);
  },

  videos(limit?: number): Video[] {
    return take(videos.filter(isPublished).sort(byOrder), limit);
  },

  socialPosts(limit?: number): SocialPost[] {
    return take(socialPosts.filter(isPublished).sort(byOrder), limit);
  },

  artists(limit?: number): Artist[] {
    return take(artists.filter(isPublished), limit);
  },

  artistById(id: string): Artist | undefined {
    return artists.find((artist) => artist.id === id);
  },

  testimonials(limit?: number): Testimonial[] {
    return take(testimonials.filter(isPublished).sort(byOrder), limit);
  },

  blogPosts(limit?: number): BlogPost[] {
    const list = blogPosts
      .filter(isPublished)
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    return take(list, limit);
  },

  blogPostBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find((post) => post.slug === slug);
  },

  /** Platform tiles for the "Listen Everywhere" strip. */
  listenPlatforms(): Platform[] {
    return listenEverywhereKeys.map(platformByKey).filter((p): p is Platform => Boolean(p));
  },

  /** Social icons rendered in the footer. */
  socialPlatforms(): Platform[] {
    return socialKeys.map(platformByKey).filter((p): p is Platform => Boolean(p));
  },

  platformByKey,
};
