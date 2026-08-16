import { useState, useMemo, useEffect } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageLayout, PageSection } from "@/components/layout/PageLayout";
import { formatDuration } from "@/lib/utils";
import { SectionHeading } from "@/components/common/SectionHeading";
import { PlatformIcon } from "@/components/common/PlatformIcon";
import { RouteLink } from "@/components/common/RouteLink";
import { contentService, select } from "@/services";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { songToTrack, songsToTracks } from "@/services/audio-player";
import { routes, songPath } from "@/data/routes";
import { brandAssets } from "@/data/assets";
import { pageMeta, withBrand } from "@/lib/seo";
import { Play, Pause, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Song } from "@/types";

export const Route = createFileRoute("/music/$slug")({
  loader: async ({ params }) => {
    const song = await contentService.getSongBySlug(params.slug);
    if (!song) throw notFound();

    const [allSongs, albums, genres, artists] = await Promise.all([
      contentService.getSongs().catch(() => []),
      contentService.getAlbums().catch(() => []),
      contentService.getGenres().catch(() => []),
      contentService.getArtists().catch(() => []),
    ]);

    const album = song.albumId ? albums.find((a) => a.id === song.albumId) : undefined;

    return {
      song,
      album,
      allSongs,
      albums,
      genres,
      artists,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData || !loaderData.song) {
      return {
        meta: pageMeta({
          title: withBrand("Song Not Found"),
          description: "This song is not available.",
          noindex: true,
        }),
      };
    }
    const { song, album } = loaderData;
    return {
      meta: pageMeta({
        title: withBrand(`${song.title} ${album ? `- ${album.title}` : ""}`),
        description:
          song.description || `Listen to ${song.title} by NaadByte — released ${song.releaseDate}.`,
        image: song.cover?.src || brandAssets.logo,
      }),
    };
  },
  component: SongPage,
  errorComponent: SongError,
  notFoundComponent: SongNotFound,
});

function getYouTubeId(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return match?.[1] || null;
}

function SongPage() {
  const { song, album, allSongs, genres, artists } = Route.useLoaderData();

  const { currentTrack, status, controls } = useAudioPlayer();
  const isPlaying = currentTrack?.id === song?.id && (status === "playing" || status === "loading");

  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setShowVideo(false);
  }, [song.slug]);

  const related = useMemo(() => {
    let list: Song[] = [];
    if (album) {
      list = allSongs.filter((s) => s.albumId === album.id && s.id !== song.id);
    }
    if (list.length < 4) {
      const genreSongs = allSongs.filter(
        (s) =>
          s.id !== song.id &&
          s.genreIds.some((gid) => song.genreIds.includes(gid)) &&
          !list.some((ls) => ls.id === s.id),
      );
      list = [...list, ...genreSongs];
    }
    if (list.length < 4) {
      const remainingSongs = allSongs.filter(
        (s) => s.id !== song.id && !list.some((ls) => ls.id === s.id),
      );
      list = [...list, ...remainingSongs];
    }
    return list.slice(0, 6);
  }, [song, album, allSongs]);

  const artistNames =
    song.artistIds.length > 0
      ? song.artistIds
          .map((id) => artists.find((a) => a.id === id)?.name ?? select.artistById(id)?.name ?? id)
          .join(", ")
      : "NaadByte";

  const genreNames =
    song.genreIds.length > 0
      ? song.genreIds
          .map((id) => genres.find((g) => g.id === id)?.name ?? select.genreById(id)?.name ?? id)
          .join(", ")
      : song.language || "Original";

  const youtubeLink = (song.streamingLinks || []).find((l) => l.platform === "youtube");
  const videoId = youtubeLink ? getYouTubeId(youtubeLink.href) : null;

  const allowedPlatforms = ["spotify", "appleMusic", "amazonMusic", "youtubeMusic", "youtube"];
  const displayStreams = (song.streamingLinks || []).filter((l) =>
    allowedPlatforms.includes(l.platform),
  );

  const coverSrc = song.cover?.src || brandAssets.logo;
  const hasAudio = Boolean(song.audioUrl);

  const handlePlaySong = () => {
    const track = songToTrack(song, artistNames);
    if (!track) return;

    if (showVideo) setShowVideo(false);

    const allTracks = songsToTracks(allSongs);
    const trackIndex = allTracks.findIndex((t) => t.id === track.id);
    if (trackIndex >= 0) {
      if (currentTrack?.id === track.id) {
        controls.toggle();
      } else {
        controls.playQueue(allTracks, trackIndex);
      }
    } else {
      if (currentTrack?.id === track.id) {
        controls.toggle();
      } else {
        controls.playQueue([track], 0);
      }
    }
  };

  const handleWatchVideo = () => {
    controls.pause();
    setShowVideo(true);
  };

  // Optional tags (max 5)
  const tags = useMemo(() => {
    const t: string[] = [];
    if (song.mood) t.push(song.mood);
    if (genreNames) t.push(genreNames.split(",")[0].trim());
    t.push("Cinematic", "Emotional", "Ambient");
    return Array.from(new Set(t)).slice(0, 5);
  }, [song.mood, genreNames]);

  // Short emotional description (2-4 lines)
  const shortDescription =
    song.description ||
    song.story ||
    `An immersive sonic journey crafted with pristine harmonic textures and emotional depth, designed to resonate deeply with the soul.`;

  return (
    <PageLayout>
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[65vh] flex flex-col justify-end pb-12 md:pb-20 pt-32 px-5 lg:px-8 overflow-hidden">
        {/* Background Blur */}
        <div className="absolute inset-0 z-0">
          <img
            src={coverSrc}
            alt=""
            className="w-full h-full object-cover opacity-30 scale-110 blur-2xl transform-gpu"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto grid gap-8 lg:grid-cols-[1fr_400px] items-end">
          <div className="flex flex-col gap-6 max-w-3xl">
            <div className="flex items-center gap-3 text-xs md:text-sm font-semibold tracking-wider uppercase text-gold">
              <span>{song.language || "Original"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
              <span>{genreNames}</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-none text-balance tracking-tight">
              {song.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm md:text-base text-foreground/80">
              <span className="font-medium text-foreground">{artistNames}</span>
              {album && (
                <>
                  <span className="text-foreground/40">•</span>
                  <span>{album.title}</span>
                </>
              )}
              {song.releaseDate && (
                <>
                  <span className="text-foreground/40">•</span>
                  <span>{song.releaseDate.substring(0, 4)}</span>
                </>
              )}
              {song.durationSeconds > 0 && (
                <>
                  <span className="text-foreground/40">•</span>
                  <span>{formatDuration(song.durationSeconds)}</span>
                </>
              )}
            </div>

            {/* Optional Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-4">
              {hasAudio && (
                <button
                  onClick={handlePlaySong}
                  className="inline-flex h-12 md:h-14 items-center justify-center gap-2 rounded-full bg-white px-8 md:px-10 text-sm md:text-base font-bold text-black transition-transform hover:scale-105 shadow-lg cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="size-5 md:size-6" fill="currentColor" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="size-5 md:size-6" fill="currentColor" /> Play Song
                    </>
                  )}
                </button>
              )}

              {videoId && (
                <button
                  onClick={handleWatchVideo}
                  className="inline-flex h-12 md:h-14 items-center justify-center gap-2 rounded-full border border-border bg-black/40 backdrop-blur-md px-8 md:px-10 text-sm md:text-base font-bold text-white transition-all hover:bg-white/10 hover:border-white/50 cursor-pointer"
                >
                  <Play className="size-5 md:size-6" /> Watch Video
                </button>
              )}
            </div>
          </div>

          <div className="hidden lg:block relative group perspective-1000">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform-gpu transition-transform duration-700">
              <img
                src={coverSrc}
                alt={song.cover?.alt || `${song.title} artwork`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <PageSection className="pt-16 pb-20">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-start">
          {/* LEFT COLUMN: About & Lyrics */}
          <div className="flex flex-col gap-16">
            {/* ABOUT THE SONG */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl md:text-3xl text-gold tracking-wide">
                ABOUT THE SONG
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
                {shortDescription}
              </p>
            </div>

            {/* LYRICS */}
            {song.lyrics && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl md:text-3xl text-gold tracking-wide">
                  LYRICS
                </h2>
                <div className="bg-card/40 rounded-2xl p-8 md:p-10 border border-border whitespace-pre-line text-base md:text-lg text-foreground/90 leading-loose font-serif">
                  {song.lyrics}
                </div>
              </div>
            )}

            {/* OFFICIAL MUSIC VIDEO */}
            {videoId && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl md:text-3xl text-gold tracking-wide">
                  OFFICIAL MUSIC VIDEO
                </h2>
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-gold/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group bg-black">
                  {showVideo ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                      title="Official Music Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 size-full border-0"
                    />
                  ) : (
                    <div className="relative size-full cursor-pointer" onClick={handleWatchVideo}>
                      <img
                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                        alt={song.title}
                        className="size-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                        <div className="flex size-20 items-center justify-center rounded-full bg-gold text-background shadow-[0_0_40px_rgba(212,175,55,0.7)] transition-transform duration-300 group-hover:scale-110">
                          <Play className="size-8 fill-current ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Listen Everywhere */}
          <div className="flex flex-col gap-8 sticky top-28">
            {displayStreams.length > 0 && (
              <div className="bg-card/70 rounded-2xl border border-border/80 p-6 md:p-8 backdrop-blur-xl shadow-xl">
                <h3 className="font-display text-xl mb-6 tracking-wide text-foreground">
                  LISTEN EVERYWHERE
                </h3>
                <div className="flex flex-col gap-3">
                  {displayStreams.map((link) => {
                    const meta = select.platformByKey(link.platform);
                    return (
                      <a
                        key={link.platform}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group flex items-center justify-between rounded-xl bg-background/60 border border-border p-4 transition-all hover:border-gold hover:bg-gold/10"
                      >
                        <div className="flex items-center gap-3.5">
                          <PlatformIcon
                            platform={link.platform}
                            className="size-5 text-muted-foreground group-hover:text-gold transition-colors"
                          />
                          <span className="text-sm md:text-base font-semibold">
                            {meta?.name ?? link.platform}
                          </span>
                        </div>
                        <ExternalLink className="size-4 text-muted-foreground group-hover:text-gold transition-colors opacity-60 group-hover:opacity-100" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </PageSection>

      {/* YOU MAY ALSO LIKE (4-6 recommended songs as cards with horizontal scroll on mobile) */}
      {related.length > 0 && (
        <PageSection className="pb-24 pt-8 border-t border-border/60">
          <SectionHeading
            eyebrow="Recommended"
            title="YOU MAY ALSO LIKE"
            subtitle="Discover more original tracks tailored to this mood."
            align="left"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 pt-4">
            {related.slice(0, 6).map((s, i) => {
              const sCover = s.cover?.src || brandAssets.logo;
              const sArtist = s.artistIds
                .map((id) => artists.find((a) => a.id === id)?.name ?? id)
                .join(", ");
              const isThisPlaying =
                currentTrack?.id === s.id && (status === "playing" || status === "loading");

              return (
                <div
                  key={s.id}
                  className="group relative flex flex-col rounded-2xl border border-border bg-card/60 p-4 transition-all hover:border-gold hover:bg-card backdrop-blur-md"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl mb-3 border border-border">
                    <img
                      src={sCover}
                      alt={s.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      onClick={() => {
                        const tr = songToTrack(s, sArtist);
                        if (!tr) return;
                        if (currentTrack?.id === tr.id) {
                          controls.toggle();
                        } else {
                          controls.playQueue([tr], 0);
                        }
                      }}
                      className="absolute bottom-2 right-2 flex size-10 items-center justify-center rounded-full bg-gold text-background opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer hover:scale-105"
                      aria-label="Play song"
                    >
                      {isThisPlaying ? (
                        <Pause className="size-4 fill-current" />
                      ) : (
                        <Play className="size-4 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                  <RouteLink
                    to={songPath(s.slug)}
                    className="font-display text-sm font-semibold truncate hover:text-gold transition-colors block mb-1"
                  >
                    {s.title}
                  </RouteLink>
                  <p className="text-xs text-muted-foreground truncate">{sArtist}</p>
                </div>
              );
            })}
          </div>
        </PageSection>
      )}
    </PageLayout>
  );
}

function SongNotFound() {
  const { slug } = Route.useParams();
  return (
    <PageLayout>
      <div className="py-32 text-center">
        <h1 className="font-display text-3xl mb-4">Song Not Found</h1>
        <p className="text-muted-foreground mb-6">We couldn't find a track at "{slug}".</p>
        <RouteLink to={routes.music} variant="outline">
          Browse All Music
        </RouteLink>
      </div>
    </PageLayout>
  );
}

function SongError() {
  return (
    <PageLayout>
      <div className="py-32 text-center">
        <h1 className="font-display text-3xl mb-4">This Track Didn't Load</h1>
        <p className="text-muted-foreground mb-6">Something went wrong. Try again.</p>
        <RouteLink to={routes.music} variant="outline">
          Browse All Music
        </RouteLink>
      </div>
    </PageLayout>
  );
}
