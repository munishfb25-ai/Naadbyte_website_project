import { useEffect } from "react";
import { createFileRoute, useLocation, useNavigate, Link } from "@tanstack/react-router";
import { PageLayout, PageSection } from "@/components/layout/PageLayout";
import { pageMeta, withBrand } from "@/lib/seo";
import { motion } from "framer-motion";
import { Play, Music, Mic2, Radio, Bell, Youtube, Sparkles } from "lucide-react";
import { albumArt, genreArt, brandAssets } from "@/data/assets";
import { PlatformIcon } from "@/components/common/PlatformIcon";
import { select } from "@/services";
import { songPath, albumPath } from "@/data/routes";

export const Route = createFileRoute("/releases")({
  head: () => ({
    meta: pageMeta({
      title: withBrand("Releases"),
      description: "Discover all NaadByte albums, EPs, and singles from YouTube & DistroKid.",
    }),
  }),
  component: ReleasesPage,
});

function ReleasesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const allSongs = select.songs();
  const allAlbums = select.albums();
  const featuredAlbums = select.featuredAlbums();

  const heroAlbum = featuredAlbums[0] || allAlbums[0];
  const heroSong = allSongs.find((s) => s.isFeatured) || allSongs[0];

  // Handle Hash Navigation for scroll
  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;

    const releaseId = hash.replace("#", "");
    const el = document.getElementById(releaseId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [location.hash]);

  return (
    <PageLayout>
      {/* Live YouTube & DistroKid Integration Status Banner */}
      <div className="bg-gold/10 border-b border-gold/20 py-3 px-4 text-center">
        <div className="mx-auto max-w-7xl flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-gold">
          <Sparkles className="size-4 animate-pulse" />
          <span>
            Live YouTube Artist Profile & DistroKid Catalog Synchronized: Showing all published releases and singles.
          </span>
        </div>
      </div>

      {/* 1. HERO SECTION */}
      <header className="relative flex min-h-[70vh] items-center overflow-hidden py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/4 top-1/2 size-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl bg-[radial-gradient(circle,oklch(0.82_0.135_82/0.7),transparent_70%)]"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-5 lg:flex-row lg:items-center lg:gap-20 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-[420px] lg:w-2/5 shrink-0"
          >
            <div className="group relative aspect-square w-full overflow-hidden rounded-[20px] bg-card shadow-2xl transition-all duration-700 hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)]">
              <img
                src={heroAlbum?.cover?.src || heroSong?.cover?.src || albumArt.neon}
                alt={heroAlbum?.title || heroSong?.title}
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="flex w-full flex-col lg:w-3/5"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="eyebrow tracking-[0.2em] text-gold font-semibold text-xs md:text-sm uppercase">
                Featured Release
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-red-600/20 text-red-400 font-bold border border-red-500/30 flex items-center gap-1">
                <Youtube className="size-3" /> YouTube & DistroKid Live
              </span>
            </div>
            <h1 className="text-balance text-4xl leading-tight md:text-5xl lg:text-6xl font-display text-white mb-2">
              {heroAlbum?.title || heroSong?.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-base md:text-lg text-foreground/80 font-medium mb-6">
              <span className="text-white">NaadByte</span>
              <span className="text-muted-foreground">•</span>
              <span>{heroAlbum?.genreIds?.[0] || heroSong?.tags?.[0] || "Cinematic & Devotional"}</span>
              <span className="text-muted-foreground">•</span>
              <span>{heroAlbum?.releaseDate || heroSong?.releaseDate || "2026"}</span>
            </div>

            <p className="max-w-xl text-pretty text-base text-muted-foreground leading-relaxed mb-8">
              {heroAlbum?.description || heroSong?.description || "Transcendent soundscapes and divine sonic experiences available on all major streaming platforms."}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                to={heroSong ? songPath(heroSong.slug) : "/music"}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gold px-10 text-sm font-semibold text-black transition-transform hover:scale-105 shadow-lg shadow-gold/20"
              >
                <Play className="size-5" fill="currentColor" />
                Listen Now
              </Link>
              {heroSong?.streamingLinks?.map((link) => (
                <a
                  key={link.platform}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur-md px-6 text-sm font-semibold text-foreground transition-all hover:bg-card hover:border-gold/50 hover:text-gold"
                >
                  <PlatformIcon platform={link.platform as any} className="size-5" />
                  <span className="capitalize">{link.platform}</span>
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Available On All Channels
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-white">
                  <PlatformIcon platform="spotify" className="size-6" /> Spotify
                </span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-white">
                  <PlatformIcon platform="appleMusic" className="size-6" /> Apple Music
                </span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-white">
                  <PlatformIcon platform="youtube" className="size-6" /> YouTube Music
                </span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-white">
                  <Radio className="size-5 text-gold" /> Amazon Music
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* 2. COMPLETE CATALOGUE GRID (All Songs & Releases) */}
      <PageSection className="pt-10 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="eyebrow tracking-[0.2em] text-gold font-semibold text-xs uppercase mb-2 block">
                Complete Catalogue ({allSongs.length} Tracks)
              </span>
              <h2 className="text-2xl md:text-3xl font-display text-white">All Published Releases</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allSongs.map((song, i) => (
              <ReleaseCard key={song.id} song={song} index={i} />
            ))}
          </div>
        </div>
      </PageSection>

      {/* 3. FEATURED ALBUMS */}
      <PageSection className="py-16 bg-background/50 border-y border-border">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between px-5 lg:px-8">
            <div>
              <span className="eyebrow tracking-[0.2em] text-gold font-semibold text-xs uppercase mb-2 block">
                Albums & EPs
              </span>
              <h2 className="text-2xl md:text-3xl font-display text-white">Featured Collections</h2>
            </div>
          </div>

          <div className="flex w-full overflow-x-auto pb-8 px-5 lg:px-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex gap-6 min-w-max">
              {allAlbums.map((album, i) => (
                <CollectionCard key={album.id} album={album} index={i} />
              ))}
            </div>
          </div>
        </div>
      </PageSection>

      {/* 4. FOOTER CTA */}
      <PageSection className="pb-32 pt-16">
        <div className="mx-auto max-w-4xl text-center flex flex-col items-center gap-8 bg-card border border-border rounded-3xl p-12 lg:p-20 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="font-display text-4xl md:text-5xl text-white">
              Discover Every NaadByte Release
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg">
              Stream all published tracks directly on YouTube, Spotify, and Apple Music.
            </p>
            <div className="mt-4">
              <a
                href="https://youtube.com/@NaadByte"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gold px-10 text-sm font-semibold text-black transition-transform hover:scale-105 shadow-lg shadow-gold/25"
              >
                <Youtube className="size-5" />
                Visit YouTube Artist Profile
              </a>
            </div>
          </div>
        </div>
      </PageSection>
    </PageLayout>
  );
}

// --- REUSABLE COMPONENTS ---

function ReleaseCard({
  song,
  index,
}: {
  song: {
    id: string;
    title: string;
    slug: string;
    releaseDate?: string;
    tags?: string[];
    cover?: { src: string; alt: string };
  };
  index: number;
}) {
  return (
    <Link
      to={songPath(song.slug)}
      className="group flex flex-col gap-4 rounded-xl p-4 bg-transparent transition-all hover:bg-card border border-transparent hover:border-gold/20 hover:shadow-[0_8px_30px_rgba(212,175,55,0.08)]"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black shadow-md">
        <img
          src={song.cover?.src || albumArt.neon}
          alt={song.title}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-gold text-black shadow-lg transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Play className="ml-1 size-6" fill="currentColor" />
          </div>
        </div>
        <div className="absolute top-2 left-2">
          <span className="px-2.5 py-1 rounded-md bg-black/70 text-white/90 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
            {song.tags?.[0] || "Release"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1 px-1">
        <h3 className="font-display text-lg text-white leading-tight transition-colors group-hover:text-gold line-clamp-1">
          {song.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>NaadByte</span>
          <span>•</span>
          <span>{song.releaseDate ? song.releaseDate.substring(0, 4) : "2026"}</span>
        </div>
      </div>
    </Link>
  );
}

function CollectionCard({
  album,
  index,
}: {
  album: {
    id: string;
    title: string;
    slug: string;
    songCount?: number;
    cover?: { src: string; alt: string };
  };
  index: number;
}) {
  return (
    <Link
      to={albumPath(album.slug)}
      className="group relative w-[280px] md:w-[360px] lg:w-[400px] aspect-[16/9] overflow-hidden rounded-2xl bg-card border border-border shadow-md transition-all hover:border-gold/40 snap-start"
    >
      <img
        src={album.cover?.src || albumArt.shiva}
        alt={album.title}
        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold mb-1">
          Album / EP
        </span>
        <h3 className="text-2xl font-display text-white transition-colors group-hover:text-gold">
          {album.title}
        </h3>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex size-14 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-hover:bg-gold group-hover:text-black">
        <Play className="ml-1 size-6" fill="currentColor" />
      </div>
    </Link>
  );
}

