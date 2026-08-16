import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { PageLayout, PageSection } from "@/components/layout/PageLayout";
import { PlatformIcon } from "@/components/common/PlatformIcon";
import { contentService, select } from "@/services";
import { getVideosServerFn } from "@/services/server-functions";
import { videosPage } from "@/content/pages";
import { pageMeta, withBrand } from "@/lib/seo";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ExternalLink } from "lucide-react";
import type { Video, PlatformKey } from "@/types";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: pageMeta({
      title: withBrand("Videos"),
      description: videosPage.description,
    }),
  }),
  loader: () => getVideosServerFn(),
  component: VideosPage,
});

const CATEGORIES = [
  "All",
  "Official Videos",
  "Visualizers",
  "Live Sessions",
  "Behind The Scenes",
  "Lyrics",
  "Trailers",
  "Shorts",
];

function pickHeroVideo(videoList: Video[]): Video | undefined {
  if (!videoList || videoList.length === 0) return undefined;

  const featured = videoList.filter((v) => v.isFeatured);
  if (featured.length > 0) {
    const sortedFeatured = [...featured].sort((a, b) => {
      const orderA = a.featuredOrder ?? a.order ?? 9999;
      const orderB = b.featuredOrder ?? b.order ?? 9999;
      return orderA - orderB;
    });
    return sortedFeatured[0];
  }

  // If none are featured, use the newest published video
  const sortedByNewest = [...videoList].sort((a, b) => {
    const timeA = a.publishedAt
      ? new Date(a.publishedAt).getTime()
      : a.year
        ? new Date(`${a.year}-01-01`).getTime()
        : 0;
    const timeB = b.publishedAt
      ? new Date(b.publishedAt).getTime()
      : b.year
        ? new Date(`${b.year}-01-01`).getTime()
        : 0;
    return timeB - timeA;
  });

  return sortedByNewest[0] || videoList[0];
}

function VideosPage() {
  const initialVideos = Route.useLoaderData();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["videos"],
    queryFn: ({ pageParam }) => getVideosServerFn({ data: { pageToken: pageParam } }),
    initialPageParam: undefined as string | undefined,
    ...(initialVideos
      ? { initialData: { pages: [initialVideos], pageParams: [undefined as string | undefined] } }
      : {}),
    getNextPageParam: (lastPage) => lastPage?.nextPageToken || undefined,
  });

  const videos = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page?.videos || []);
  }, [data]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [userSelected, setUserSelected] = useState(false);

  // Set initial video using the hero selection logic
  const [activeVideo, setActiveVideo] = useState<Video | undefined>(() => pickHeroVideo(videos));
  const [isPlaying, setIsPlaying] = useState(false);
  const { controls: audioControls } = useAudioPlayer();
  const location = useLocation();
  const navigate = useNavigate();

  // Sync activeVideo when videos change (e.g. from async WordPress fetch) if user hasn't manually picked one
  useEffect(() => {
    if (!userSelected && videos.length > 0) {
      setActiveVideo((prev) => {
        if (!prev) return pickHeroVideo(videos);
        return videos.find((v) => v.id === prev.id) || pickHeroVideo(videos);
      });
    }
  }, [videos, userSelected]);

  // Handle Hash Navigation for Play/Filter
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;

    if (hash.startsWith("play-")) {
      const videoId = hash.replace("play-", "");
      const video = videos.find(
        (v) => v.id === videoId || v.videoId === videoId || v.slug === videoId,
      );
      if (video) {
        setUserSelected(true);
        setActiveVideo(video);
        setIsPlaying(true);
        audioControls.pause();
        // smooth scroll to top where player is
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      // Clear hash gracefully without reloading
      navigate({ to: "/videos", replace: true });
    }
  }, [location.hash, videos, audioControls, navigate]);

  const filteredVideos = useMemo(() => {
    if (activeCategory === "All") return videos;
    return videos.filter((v) => v.category === activeCategory);
  }, [videos, activeCategory]);

  const handlePlayInline = () => {
    audioControls.pause();
    setIsPlaying(true);
  };

  const handleVideoSelect = (video: Video) => {
    setUserSelected(true);
    setActiveVideo(video);
    setIsPlaying(true);
    audioControls.pause();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PageLayout>
      {/* 1. HERO - FEATURED VIDEO */}
      {activeVideo && (
        <PageSection className="pt-24 pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeVideo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mx-auto flex w-full max-w-6xl flex-col gap-8"
            >
              {/* Video Player / Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-deep bg-black">
                {isPlaying ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                    allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                    className="size-full border-0"
                    title={activeVideo.title}
                  />
                ) : (
                  <button
                    onClick={handlePlayInline}
                    className="group relative size-full cursor-pointer outline-none"
                    aria-label={`Play ${activeVideo.title}`}
                  >
                    <img
                      src={
                        activeVideo.thumbnail ||
                        `https://img.youtube.com/vi/${activeVideo.videoId}/maxresdefault.jpg`
                      }
                      alt={activeVideo.title}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                    />
                    <div className="absolute inset-0 bg-background/20 transition-colors duration-300 group-hover:bg-background/40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex size-20 md:size-24 items-center justify-center rounded-full bg-gold/90 text-black shadow-[0_0_40px_rgba(212,175,55,0.4)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        <Play className="ml-2 size-8 md:size-10" fill="currentColor" />
                      </div>
                    </div>
                  </button>
                )}
              </div>

              {/* Video Info */}
              <div className="flex flex-col gap-4 px-2 md:px-4">
                <div className="flex flex-wrap items-center gap-3">
                  {activeVideo.genreStr && (
                    <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold uppercase tracking-widest border border-gold/20">
                      {activeVideo.genreStr}
                    </span>
                  )}
                  {activeVideo.year && (
                    <span className="text-sm font-medium text-foreground/80">
                      {activeVideo.year}
                    </span>
                  )}
                  {activeVideo.duration && (
                    <span className="text-sm font-medium text-foreground/60">
                      • {activeVideo.duration}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-balance text-foreground">
                  {activeVideo.title}
                </h1>

                <p className="text-base md:text-lg text-foreground/70 max-w-3xl leading-relaxed">
                  {activeVideo.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-2">
                  {!isPlaying && (
                    <button
                      onClick={handlePlayInline}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-8 text-sm font-semibold text-black transition-transform hover:scale-105 shadow-lg shadow-gold/20"
                    >
                      <Play className="size-4" fill="currentColor" />
                      Watch Now
                    </button>
                  )}
                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideo.videoId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur-md px-8 text-sm font-semibold text-foreground transition-all hover:bg-card hover:border-gold/50 hover:text-gold"
                  >
                    View on YouTube
                    <ExternalLink className="size-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </PageSection>
      )}

      {/* 3. VIDEO CATEGORIES */}
      <PageSection id="video-grid" className="pt-8 pb-4">
        <div className="flex w-full overflow-x-auto scrollbar-hide pb-4 -mx-5 px-5 lg:-mx-8 lg:px-8">
          <div className="flex gap-2 min-w-max mx-auto">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-black"
                      : "text-muted-foreground hover:text-foreground hover:bg-card border-transparent border"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-gold rounded-full"
                      transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </PageSection>

      {/* 4. VIDEO GRID */}
      <PageSection className="pt-0">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredVideos.map((video) => (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <button
                  onClick={() => handleVideoSelect(video)}
                  className="group flex flex-col gap-4 text-left w-full outline-none"
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-card border border-border shadow-md transition-all duration-500 group-hover:border-gold/40 group-hover:shadow-[0_8px_30px_rgb(212,175,55,0.15)] group-hover:-translate-y-1">
                    <img
                      src={
                        video.thumbnail ||
                        `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`
                      }
                      alt={video.title}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      {video.genreStr && (
                        <span className="px-2 py-1 rounded bg-black/60 text-white/90 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                          {video.genreStr}
                        </span>
                      )}
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/80 text-white text-xs font-medium backdrop-blur-md">
                        {video.duration}
                      </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                      <div className="flex size-12 items-center justify-center rounded-full bg-gold text-black transform scale-75 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                        <Play className="ml-1 size-5" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 px-1">
                    <h3 className="font-display text-lg leading-tight transition-colors group-hover:text-gold line-clamp-1">
                      {video.title}
                    </h3>
                    {video.year && <p className="text-sm text-muted-foreground">{video.year}</p>}
                  </div>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {filteredVideos.length === 0 && !isLoading && (
          <div className="py-20 text-center text-muted-foreground">
            No videos found for this category.
          </div>
        )}

        {hasNextPage && activeCategory === "All" && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-8 text-sm font-semibold text-foreground transition-all hover:bg-card/80 hover:border-gold/50 hover:text-gold disabled:opacity-50"
            >
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </PageSection>

      {/* 6. FEATURE STRIP */}
      <PageSection className="pb-24">
        <div className="w-full rounded-2xl border border-border bg-card/50 p-8 md:p-12 text-center shadow-lg">
          <span className="eyebrow block mb-6 tracking-[0.2em] text-gold font-semibold text-xs md:text-sm uppercase">
            Watch Across Every Platform
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {[
              { id: "youtube", label: "YouTube" },
              { id: "instagram", label: "Instagram" },
              { id: "facebook", label: "Facebook" },
              { id: "spotify", label: "Spotify" },
            ].map((platform) => (
              <a
                key={platform.id}
                href="#"
                className="group flex flex-col items-center gap-3 transition-colors hover:text-gold text-muted-foreground"
              >
                <div className="flex size-14 items-center justify-center rounded-full border border-border bg-background transition-all group-hover:border-gold group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  <PlatformIcon platform={platform.id as PlatformKey} className="size-6" />
                </div>
                <span className="text-xs font-medium uppercase tracking-wider">
                  {platform.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </PageSection>
    </PageLayout>
  );
}
