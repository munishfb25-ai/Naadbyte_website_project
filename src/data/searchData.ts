import { albumArt, genreArt } from "./assets";

export type SearchResultType = "song" | "video" | "release" | "genre" | "language";

export interface SearchItem {
  id: string;
  title: string;
  type: SearchResultType;
  subtitle?: string;
  thumbnail?: string;
  url: string;
}

export const globalSearchData: SearchItem[] = [
  // SONGS
  {
    id: "s1",
    title: "Paise Ka Tantra",
    type: "song",
    subtitle: "Electronic / Rap",
    thumbnail: albumArt.neon,
    url: "/music#play-s1",
  },
  {
    id: "s2",
    title: "Shiva Within",
    type: "song",
    subtitle: "Devotional",
    thumbnail: albumArt.shiva,
    url: "/music#play-s2",
  },
  {
    id: "s3",
    title: "Young G.O.A.T.",
    type: "song",
    subtitle: "Hip Hop",
    thumbnail: albumArt.rise,
    url: "/music#play-s3",
  },
  {
    id: "s4",
    title: "Finding Her",
    type: "song",
    subtitle: "Cinematic",
    thumbnail: albumArt.echoes,
    url: "/music#play-s4",
  },
  {
    id: "s5",
    title: "Sanam Teri Kasam",
    type: "song",
    subtitle: "Romantic",
    thumbnail: genreArt.hindi,
    url: "/music#play-s5",
  },
  {
    id: "s6",
    title: "Raanjhan",
    type: "song",
    subtitle: "Punjabi",
    thumbnail: genreArt.punjabi,
    url: "/music#play-s6",
  },

  // VIDEOS
  {
    id: "v1",
    title: "Shiva Within Official Visualizer",
    type: "video",
    subtitle: "Visualizer",
    thumbnail: albumArt.shiva,
    url: "/videos#play-v1",
  },
  {
    id: "v2",
    title: "Finding Her",
    type: "video",
    subtitle: "Official Music Video",
    thumbnail: albumArt.echoes,
    url: "/videos#play-v2",
  },
  {
    id: "v3",
    title: "Paise Ka Tantra (Live)",
    type: "video",
    subtitle: "Live Session",
    thumbnail: albumArt.neon,
    url: "/videos#play-v3",
  },

  // RELEASES
  {
    id: "r1",
    title: "Young G.O.A.T.",
    type: "release",
    subtitle: "EP • 2026",
    thumbnail: albumArt.rise,
    url: "/releases#r1",
  },
  {
    id: "r2",
    title: "Raanjhan",
    type: "release",
    subtitle: "Single • 2026",
    thumbnail: genreArt.punjabi,
    url: "/releases#r2",
  },

  // GENRES & LANGUAGES
  {
    id: "g1",
    title: "Devotional",
    type: "genre",
    subtitle: "Music Category",
    url: "/music#filter-Devotional",
  },
  {
    id: "g2",
    title: "Electronic",
    type: "genre",
    subtitle: "Music Category",
    url: "/music#filter-Electronic",
  },
  { id: "l1", title: "Hindi", type: "language", subtitle: "Language", url: "/music#filter-Hindi" },
  {
    id: "g3",
    title: "Punjabi",
    type: "genre",
    subtitle: "Music Category",
    url: "/music#filter-Punjabi",
  },
  {
    id: "g4",
    title: "Motivational",
    type: "genre",
    subtitle: "Music Category",
    url: "/music#filter-Motivational",
  },
];
