import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { PageLayout, PageSection } from "@/components/layout/PageLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Play, Pause, ChevronDown, Music2, Info } from "lucide-react";
import { brandAssets } from "@/data/assets";
import { songPath } from "@/data/routes";
import { select } from "@/services";
import { songToTrack, songsToTracks } from "@/services/audio-player";
import type { Song, AudioTrack } from "@/types";

export const Route = createFileRoute("/music/")({
  component: MusicIndexComponent,
  meta: () => [
    {
      title: "Music Library | NaadByte",
      description: "Browse and listen to the complete NaadByte music library",
    },
  ],
});

const filterCategories = ["All", "Devotional", "Cinematic", "EDM", "Motivation", "Ambient"];
const sortOptions = ["Newest", "Oldest", "A-Z", "Z-A"];

function MusicIndexComponent() {
  const catalogSongs = useMemo(() => select.songs(), []);
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeHeroSong, setActiveHeroSong] = useState<Song | null>(catalogSongs[0] || null);

  const { currentTrack, status, controls } = useAudioPlayer();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle Hash Navigation for Play/Filter
  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;

    if (hash.startsWith("play-")) {
      const songId = hash.replace("play-", "");
      const song = catalogSongs.find((s) => s.id === songId);
      if (song) {
        setActiveHeroSong(song);
        controls.playQueue([songToTrack(song)], 0);
      }
      navigate({ to: "/music", replace: true });
    } else if (hash.startsWith("filter-")) {
      const filter = hash.replace("filter-", "");
      setActiveFilter(filter);
      navigate({ to: "/music", replace: true });
    }
  }, [location.hash, navigate, controls, catalogSongs]);

  // Set initial hero song on mount if not set
  useEffect(() => {
    if (catalogSongs.length > 0 && !activeHeroSong) {
      setActiveHeroSong(catalogSongs[0]);
    }
  }, [catalogSongs, activeHeroSong]);

  const processedSongs = useMemo(() => {
    let result = [...catalogSongs];

    if (activeFilter !== "All") {
      result = result.filter((song) =>
        song.genreIds.some((g) => g.toLowerCase() === activeFilter.toLowerCase()),
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((song) => {
        const artistName = song.artistIds
          .map((id) => select.artistById(id)?.name || id)
          .join(" ")
          .toLowerCase();
        return song.title.toLowerCase().includes(q) || artistName.includes(q);
      });
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "A-Z":
          return a.title.localeCompare(b.title);
        case "Z-A":
          return b.title.localeCompare(a.title);
        case "Newest":
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        case "Oldest":
          return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [activeFilter, sortBy, searchQuery, catalogSongs]);

  // Handle Play/Pause for the main featured hero item
  const handlePlayHero = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!activeHeroSong) return;

    if (currentTrack?.id === activeHeroSong.id) {
      controls.toggle();
      return;
    }

    const allTracks = songsToTracks(catalogSongs);
    const index = allTracks.findIndex((t) => t.id === activeHeroSong.id);
    controls.playQueue(allTracks, Math.max(0, index));
  };

  const handleRailClick = (song: Song, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveHeroSong(song);

    if (currentTrack?.id === song.id) {
      controls.toggle();
    } else {
      const allTracks = songsToTracks(catalogSongs);
      const index = allTracks.findIndex((t) => t.id === song.id);
      controls.playQueue(allTracks, Math.max(0, index));
    }
  };

  const handleLibraryClick = (song: Song, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentTrack?.id === song.id) {
      controls.toggle();
    } else {
      const allTracks = songsToTracks(processedSongs);
      const index = allTracks.findIndex((t) => t.id === song.id);
      controls.playQueue(allTracks, Math.max(0, index));
    }
  };

  if (!activeHeroSong) return null;

  const heroArtistName = activeHeroSong.artistIds
    .map((id) => select.artistById(id)?.name || id)
    .join(", ");

  const isHeroPlaying =
    currentTrack?.id === activeHeroSong.id && (status === "playing" || status === "loading");

  return (
    <PageLayout>
      {/* 1. NETFLIX-STYLE HERO SECTION */}
      <section className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] flex items-end pb-20 md:pb-32 overflow-hidden">
        {/* Background Image & Gradient Masks */}
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeHeroSong.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              src={activeHeroSong.cover.src}
              alt={activeHeroSong.title}
              className="w-full h-full object-cover object-top"
            />
          </AnimatePresence>
          {/* Multiple gradients for Netflix-style depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-start gap-4">
          <motion.div
            key={`info-${activeHeroSong.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            {/* Title Image or Text */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white tracking-tight uppercase leading-none drop-shadow-2xl max-w-3xl">
              {activeHeroSong.title}
            </h1>

            {/* Metadata row */}
            <div className="flex items-center gap-4 text-sm md:text-base font-medium text-white/90">
              <span className="text-gold font-bold">New Release</span>
              <span>2024</span>
              <span className="px-2 py-0.5 border border-white/30 rounded text-xs tracking-wider">
                {activeHeroSong.genreIds[0]?.toUpperCase()}
              </span>
              <span>
                {Math.floor(activeHeroSong.durationSeconds / 60)}:
                {String(activeHeroSong.durationSeconds % 60).padStart(2, "0")}
              </span>
            </div>

            {/* Synopsis */}
            <p className="max-w-xl text-lg text-white/80 leading-relaxed mt-2 drop-shadow-md line-clamp-3">
              Experience the latest sonic journey from NaadByte. A masterful blend of atmospheric
              textures and driving rhythms designed to transport you to another dimension.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={handlePlayHero}
                className="flex items-center gap-3 px-8 py-3.5 bg-white text-black rounded-lg font-bold hover:bg-white/90 transition-colors shadow-lg"
              >
                {isHeroPlaying ? (
                  <>
                    <Pause className="size-6 fill-black" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="size-6 fill-black" /> Play Now
                  </>
                )}
              </button>
              {activeHeroSong.slug && (
                <Link
                  to={songPath(activeHeroSong.slug)}
                  className="flex items-center gap-3 px-8 py-3.5 bg-zinc-500/40 backdrop-blur-md text-white border border-white/10 rounded-lg font-bold hover:bg-zinc-500/50 transition-colors"
                >
                  <Info className="size-5" />
                  More Info
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. DISCOVER RAIL (Horizontal Scrolling) */}
      <section className="relative z-20 w-full max-w-7xl mx-auto -mt-16 md:-mt-24 mb-16">
        <div className="px-6 md:px-12">
          <h3 className="text-xl font-bold text-white mb-4">Trending Now</h3>
        </div>

        <div className="w-full overflow-x-auto pb-6 px-6 md:px-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-4 w-max">
            {catalogSongs.map((song) => {
              const isActive = activeHeroSong?.id === song.id;

              return (
                <button
                  key={`rail-${song.id}`}
                  onClick={(e) => handleRailClick(song, e)}
                  className={`group relative flex-shrink-0 w-[160px] md:w-[200px] aspect-video rounded-md overflow-hidden transition-all duration-500 hover:scale-105 hover:z-30 cursor-pointer
                    ${isActive ? "ring-2 ring-white scale-105 z-20" : "opacity-70 hover:opacity-100 scale-100 z-10"}
                  `}
                >
                  <img
                    src={song.cover.src}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={song.title}
                  />
                  {/* Subtle gradient for text readability if we wanted to overlay text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Quick play overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] bg-black/20">
                    <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-black/40">
                      <Play className="size-5 text-white ml-1 fill-white" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FULL LIBRARY BROWSER */}
      <PageSection className="relative z-10 bg-zinc-950">
        <div className="max-w-7xl mx-auto w-full pt-8">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-gold tracking-[0.2em] uppercase text-sm font-semibold mb-2">
                Complete Collection
              </p>
              <h2 className="text-3xl md:text-4xl font-display text-white">
                Browse by Mood & Genre
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              {/* Premium Sort Dropdown */}
              <div className="relative w-full sm:w-[180px]">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex w-full items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-gold/50"
                >
                  <span className="truncate">{sortBy}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 z-50 mt-2 w-full origin-top-right rounded-xl border border-white/10 bg-zinc-950 py-1 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortBy(option);
                            setIsSortOpen(false);
                          }}
                          className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                            sortBy === option
                              ? "bg-gold/10 text-gold font-medium"
                              : "text-zinc-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2.5 mb-10 pb-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {filterCategories.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-shrink-0
                    ${
                      isActive
                        ? "bg-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105"
                        : "bg-transparent border border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/60"
                    }
                  `}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {/* Results Header */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gold/80 font-medium uppercase tracking-widest">
              Showing {processedSongs.length} {activeFilter !== "All" ? activeFilter : ""}{" "}
              {processedSongs.length === 1 ? "song" : "songs"}
            </p>
          </div>

          {/* Music Library Grid */}
          <div className="min-h-[300px]">
            {processedSongs.length > 0 ? (
              <motion.div
                layout
                className="flex flex-wrap gap-4 md:gap-5 justify-center lg:justify-start"
              >
                <AnimatePresence>
                  {processedSongs.map((song) => {
                    const isPlaying =
                      currentTrack?.id === song.id &&
                      (status === "playing" || status === "loading");

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        key={`lib-${song.id}`}
                        className="relative group"
                      >
                        <button
                          onClick={(e) => handleLibraryClick(song, e)}
                          className={`relative w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px] rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer
                            ${
                              isPlaying
                                ? "border-gold shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105"
                                : "border-white/10 hover:border-gold/60 shadow-md hover:shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                            }
                          `}
                        >
                          <img
                            src={song.cover.src}
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                            alt={song.title}
                          />

                          {/* Dark Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                            {isPlaying ? (
                              <Pause className="size-5 md:size-6 text-gold" fill="currentColor" />
                            ) : (
                              <Play
                                className="ml-0.5 size-5 md:size-6 text-white"
                                fill="currentColor"
                              />
                            )}
                          </div>
                        </button>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none z-50 flex flex-col items-center">
                          <p className="text-xs font-semibold text-white">{song.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{song.artist}</p>
                          {/* Triangle pointer */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-zinc-800" />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="flex size-16 items-center justify-center rounded-full bg-white/5 border border-white/10 mb-4">
                  <Music2 className="size-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-display text-white mb-2">No songs found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
                <button
                  onClick={() => {
                    setActiveFilter("All");
                    setSearchQuery("");
                  }}
                  className="mt-6 text-sm text-gold hover:text-gold/80 transition-colors underline underline-offset-4"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </PageSection>
    </PageLayout>
  );
}
