import type { Album, FeaturedRelease } from "@/types";
import { albumArt } from "./assets";

export const albums: Album[] = [
  {
    id: "album-mere-shyam-bajaye",
    slug: "mere-shyam-bajaye-baansuriya",
    title: "Mere Shyam Bajaye Baansuriya",
    genre: "Devotional",
    genreIds: ["devotional"],
    artistIds: ["artist-naadbyte"],
    year: "2026",
    releaseDate: "2026-08-10",
    cover: { src: albumArt.shiva, alt: "Mere Shyam Bajaye Baansuriya cover" },
    description:
      "Official DistroKid release distributed via HyperFollow to Spotify, Apple Music, YouTube Music, and Amazon Music.",
    songIds: ["song-mere-shyam-bajaye"],
    streamingLinks: [
      { platform: "spotify", href: "https://distrokid.com/hyperfollow/naadbyte/-----mere-shyam-bajaye-baansuriya" },
      { platform: "appleMusic", href: "https://distrokid.com/hyperfollow/naadbyte/-----mere-shyam-bajaye-baansuriya" },
      { platform: "youtubeMusic", href: "https://distrokid.com/hyperfollow/naadbyte/-----mere-shyam-bajaye-baansuriya" },
      { platform: "amazonMusic", href: "https://distrokid.com/hyperfollow/naadbyte/-----mere-shyam-bajaye-baansuriya" }
    ],
    isFeatured: true,
    status: "published",
  },
  {
    id: "paise-ka-tantra",
    slug: "paise-ka-tantra",
    title: "Paise ka tantra (Revised)",
    genre: "Electronic / Rap",
    genreIds: ["electronic"],
    artistIds: ["artist-naadbyte"],
    year: "2026",
    releaseDate: "2026-08-01",
    cover: { src: albumArt.neon, alt: "Paise ka tantra cover" },
    description:
      "Official DistroKid release distributed to YouTube Music, blending modern electronic production with hard-hitting rhythm.",
    songIds: ["song-paise-ka-tantra"],
    streamingLinks: [
      { platform: "spotify", href: "https://open.spotify.com" },
      { platform: "appleMusic", href: "https://music.apple.com" },
      { platform: "youtubeMusic", href: "https://music.youtube.com" },
    ],
    isFeatured: true,
    status: "published",
  },
  {
    id: "aghori",
    slug: "aghori",
    title: "Aghori (Revisited)",
    genre: "Devotional / Electronic",
    genreIds: ["devotional"],
    artistIds: ["artist-naadbyte"],
    year: "2026",
    releaseDate: "2026-07-18",
    cover: { src: albumArt.shiva, alt: "Aghori Revisited cover" },
    description:
      "Official DistroKid audio release exploring the profound mystic path of the Aghora with deep meditative frequencies.",
    songIds: ["song-aghori-revisited"],
    streamingLinks: [
      { platform: "spotify", href: "https://open.spotify.com" },
      { platform: "appleMusic", href: "https://music.apple.com" },
      { platform: "youtubeMusic", href: "https://music.youtube.com" },
    ],
    isFeatured: true,
    status: "published",
  },
  {
    id: "pranadhar-hamare",
    slug: "pranadhar-hamare",
    title: "Pranadhar Hamare",
    genre: "Devotional",
    genreIds: ["devotional"],
    artistIds: ["artist-naadbyte"],
    year: "2026",
    releaseDate: "2026-07-18",
    cover: { src: albumArt.shiva, alt: "Pranadhar Hamare cover" },
    description:
      "Official DistroKid single release dedicated to the divine life-breath and cosmic protector.",
    songIds: ["song-pranadhar-hamare"],
    streamingLinks: [
      { platform: "spotify", href: "https://open.spotify.com" },
      { platform: "appleMusic", href: "https://music.apple.com" },
      { platform: "youtubeMusic", href: "https://music.youtube.com" },
    ],
    isFeatured: true,
    status: "published",
  },
  {
    id: "bolo-narayan",
    slug: "bolo-narayan",
    title: "Bolo Narayan! Narayan! Hari Hari!",
    genre: "Devotional / Cinematic",
    genreIds: ["devotional"],
    artistIds: ["artist-naadbyte"],
    year: "2026",
    releaseDate: "2026-07-12",
    cover: { src: albumArt.echoes, alt: "Bolo Narayan cover" },
    description:
      "Official DistroKid orchestrated epic and original releases of the sacred Narayana chant distributed to YouTube Music.",
    songIds: ["song-bolo-narayan-epic", "song-bolo-narayan-original"],
    streamingLinks: [
      { platform: "spotify", href: "https://open.spotify.com" },
      { platform: "appleMusic", href: "https://music.apple.com" },
      { platform: "youtubeMusic", href: "https://music.youtube.com" },
    ],
    isFeatured: true,
    status: "published",
  },
];

/** Editor-curated homepage ordering, independent of the catalogue. */
export const featuredReleases: FeaturedRelease[] = [
  { id: "fr-1", albumId: "paise-ka-tantra", order: 1 },
  { id: "fr-2", albumId: "aghori", order: 2 },
  { id: "fr-3", albumId: "pranadhar-hamare", order: 3 },
  { id: "fr-4", albumId: "bolo-narayan", order: 4 },
];
