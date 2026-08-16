import { albums, featuredReleases } from "@/data/albums";
import { artists } from "@/data/artists";
import { blogPosts } from "@/data/blog";
import { genres } from "@/data/genres";
import { platformDirectory } from "@/data/platforms";
import { socialPosts } from "@/data/social-posts";
import { songRequests } from "@/data/song-requests";
import { songs } from "@/data/songs";
import { testimonials } from "@/data/testimonials";
import { videos } from "@/data/videos";
import type { SongRequest, SongRequestInput, Video } from "@/types";
import type { ContentProvider } from "./content-provider";

/**
 * Local, in-memory provider backed by the mock data in `src/data`.
 * Deterministic and SSR-safe.
 */
export const localContentProvider: ContentProvider = {
  name: "local",

  async getSongs() {
    return songs;
  },
  async getSongBySlug(slug) {
    return songs.find((s) => s.slug === slug);
  },

  async getAlbums() {
    return albums;
  },
  async getAlbumBySlug(slug) {
    return albums.find((a) => a.slug === slug);
  },
  async getFeaturedReleases() {
    return featuredReleases;
  },

  async getGenres() {
    return genres;
  },
  async getGenreBySlug(slug) {
    return genres.find((g) => g.slug === slug);
  },

  async getVideos(
    pageToken?: string | undefined,
  ): Promise<{ videos: Video[]; nextPageToken?: string | undefined; totalResults: number }> {
    const limit = 12;
    const page = pageToken ? parseInt(pageToken) : 1;
    const startIndex = (page - 1) * limit;
    const pageVideos = videos.slice(startIndex, startIndex + limit);
    const nextPageToken = startIndex + limit < videos.length ? String(page + 1) : undefined;
    return { videos: pageVideos, nextPageToken, totalResults: videos.length };
  },
  async getSocialPosts() {
    return socialPosts;
  },
  async getPlatforms() {
    return platformDirectory;
  },

  async getArtists() {
    return artists;
  },
  async getTestimonials() {
    return testimonials;
  },
  async getBlogPosts() {
    return blogPosts;
  },
  async getBlogPostBySlug(slug) {
    return blogPosts.find((p) => p.slug === slug);
  },
  async getSongRequests() {
    return songRequests;
  },
  async submitSongRequest(input: SongRequestInput): Promise<SongRequest> {
    // Placeholder persistence — swap for a server function / CMS endpoint.
    return {
      ...input,
      id: `req-${songRequests.length + 1}`,
      status: "new",
    };
  },
};
