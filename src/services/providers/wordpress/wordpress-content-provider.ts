import { routes } from "@/data/routes";
import type { SongRequest, SongRequestInput } from "@/types";
import type { ContentProvider } from "../content-provider";
import { wordpressEndpoints, wpFetch } from "./config";
import type { WpPost } from "./mappers";
import {
  mapAlbum,
  mapArtist,
  mapBlogPost,
  mapFeaturedRelease,
  mapGenre,
  mapSocialPost,
  mapSong,
  mapTestimonial,
  mapVideo,
} from "./mappers";

/**
 * WordPress implementation of `ContentProvider`.
 *
 * WordPress is the editorial/admin layer; this module is the only place that
 * knows about its REST payloads. Components keep consuming the same models.
 * Read-only and unauthenticated — published content only, no credentials.
 */
export const wordpressContentProvider: ContentProvider = {
  name: "wordpress",

  async getSongs() {
    return (await wpFetch<WpPost[]>(wordpressEndpoints.song)).map(mapSong);
  },
  async getSongBySlug(slug: string) {
    const posts = await wpFetch<WpPost[]>(wordpressEndpoints.song, { slug });
    return posts[0] ? mapSong(posts[0]) : undefined;
  },

  async getAlbums() {
    return (await wpFetch<WpPost[]>(wordpressEndpoints.album)).map(mapAlbum);
  },
  async getAlbumBySlug(slug: string) {
    const posts = await wpFetch<WpPost[]>(wordpressEndpoints.album, { slug });
    return posts[0] ? mapAlbum(posts[0]) : undefined;
  },
  async getFeaturedReleases() {
    const albums = (await wpFetch<WpPost[]>(wordpressEndpoints.album)).map(mapAlbum);
    return albums
      .filter((album) => album.isFeatured)
      .map((album, index) => mapFeaturedRelease(album, index + 1))
      .sort((a, b) => a.order - b.order);
  },

  async getGenres() {
    return (await wpFetch<WpPost[]>(wordpressEndpoints.genre)).map((post) =>
      mapGenre(post, routes.music),
    );
  },
  async getGenreBySlug(slug: string) {
    const posts = await wpFetch<WpPost[]>(wordpressEndpoints.genre, { slug });
    return posts[0] ? mapGenre(posts[0], routes.music) : undefined;
  },

  async getVideos() {
    const { youtubeContentProvider } = await import("../youtube/youtube-content-provider");
    return youtubeContentProvider.getVideos();
  },
  async getSocialPosts() {
    return (await wpFetch<WpPost[]>(wordpressEndpoints.socialPost)).map(mapSocialPost);
  },

  async getPlatforms() {
    // Platform profiles are brand chrome, not editorial content.
    const { platformDirectory } = await import("@/data/platforms");
    return platformDirectory;
  },

  async getArtists() {
    return (await wpFetch<WpPost[]>(wordpressEndpoints.artist)).map(mapArtist);
  },
  async getTestimonials() {
    return (await wpFetch<WpPost[]>(wordpressEndpoints.testimonial)).map(mapTestimonial);
  },
  async getBlogPosts() {
    return (await wpFetch<WpPost[]>(wordpressEndpoints.blogPost)).map(mapBlogPost);
  },
  async getBlogPostBySlug(slug: string) {
    const posts = await wpFetch<WpPost[]>(wordpressEndpoints.blogPost, { slug });
    return posts[0] ? mapBlogPost(posts[0]) : undefined;
  },

  async getSongRequests(): Promise<SongRequest[]> {
    // Requests are private: reading them requires an authenticated server call.
    return [];
  },
  async submitSongRequest(_input: SongRequestInput): Promise<SongRequest> {
    // Submissions must be signed server-side (application password / webhook),
    // so this provider never writes from the browser.
    throw new Error(
      "submitSongRequest is not available from the browser — post through a server function.",
    );
  },
};
