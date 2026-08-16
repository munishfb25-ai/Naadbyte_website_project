import type {
  Album,
  Artist,
  BlogPost,
  FeaturedRelease,
  Genre,
  Platform,
  SocialPost,
  Song,
  SongRequest,
  SongRequestInput,
  Testimonial,
  Video,
} from "@/types";

/**
 * The single port every content source must implement.
 *
 * Today it is fulfilled by `localContentProvider` (bundled mock data).
 * Tomorrow a `wordpressContentProvider` can implement the same interface by
 * calling the WP REST API — no component or section changes required.
 */
export type ContentProvider = {
  readonly name: string;

  getSongs(): Promise<Song[]>;
  getSongBySlug(slug: string): Promise<Song | undefined>;

  getAlbums(): Promise<Album[]>;
  getAlbumBySlug(slug: string): Promise<Album | undefined>;
  getFeaturedReleases(): Promise<FeaturedRelease[]>;

  getGenres(): Promise<Genre[]>;
  getGenreBySlug(slug: string): Promise<Genre | undefined>;

  getVideos(
    pageToken?: string | undefined,
  ): Promise<{ videos: Video[]; nextPageToken?: string | undefined }>;
  getSocialPosts(): Promise<SocialPost[]>;
  getPlatforms(): Promise<Platform[]>;

  /** Future-ready surfaces — implemented, simply not rendered yet. */
  getArtists(): Promise<Artist[]>;
  getTestimonials(): Promise<Testimonial[]>;
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getSongRequests(): Promise<SongRequest[]>;
  submitSongRequest(input: SongRequestInput): Promise<SongRequest>;
};
