import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Play, Pause, Disc3, ArrowRight, Heart, Share2, Info } from "lucide-react";
import { contentService, select } from "@/services";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { songToTrack, songsToTracks } from "@/services/audio-player";
import { brandAssets } from "@/data/assets";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Link } from "@tanstack/react-router";
import { songPath, routes } from "@/data/routes";
import { formatDuration } from "@/lib/utils";
import { useState } from "react";
import type { Song } from "@/types";

function OriginalTrackRow({
  song,
  index,
  allSongs,
}: {
  song: Song;
  index: number;
  allSongs: Song[];
}) {
  const { currentTrack, status, controls } = useAudioPlayer();
  const track = songToTrack(song);
  const isPlaying = currentTrack?.id === song.id && (status === "playing" || status === "loading");
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePlay = () => {
    if (!track) return;
    if (currentTrack?.id === track.id) {
      controls.toggle();
    } else {
      const allTracks = songsToTracks(allSongs);
      const idx = allTracks.findIndex((t) => t.id === track.id);
      if (idx >= 0) {
        controls.playQueue(allTracks, idx);
      } else {
        controls.playQueue([track], 0);
      }
    }
  };

  const coverSrc = song.cover?.src || brandAssets.logo;
  const artistName = song.artistIds.map((id) => select.artistById(id)?.name || id).join(", ");
  const genreName =
    song.genreIds.length > 0
      ? select.genreById(song.genreIds[0] as string)?.name || song.genreIds[0]
      : song.language || "Original";

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + songPath(song.slug));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`group relative flex items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-300 ${
        isPlaying
          ? "bg-gold/15 border-gold/60 shadow-[0_0_30px_rgba(212,175,55,0.25)]"
          : "bg-card/50 border-border/80 hover:border-gold/40 hover:bg-card/80 backdrop-blur-md"
      }`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={handlePlay}
          className="relative size-16 shrink-0 rounded-xl overflow-hidden border border-border group-hover:border-gold transition-colors cursor-pointer"
          aria-label={isPlaying ? "Pause track" : "Play track"}
        >
          <img src={coverSrc} alt={song.title} className="size-full object-cover" />
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {isPlaying ? (
              <Pause className="size-6 text-gold fill-current" />
            ) : (
              <Play className="size-6 text-gold fill-current ml-0.5" />
            )}
          </div>
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[0.65rem] uppercase tracking-wider font-semibold text-gold px-2 py-0.5 rounded bg-gold/10">
              {genreName}
            </span>
            <span className="text-xs text-muted-foreground">
              {song.durationSeconds ? formatDuration(song.durationSeconds) : "3:45"}
            </span>
          </div>
          <Link
            to={songPath(song.slug)}
            className="font-display text-base md:text-lg font-semibold truncate block hover:text-gold transition-colors"
          >
            {song.title}
          </Link>
          <p className="text-xs md:text-sm text-muted-foreground truncate">{artistName}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handlePlay}
          className="flex size-11 items-center justify-center rounded-full bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-background transition-all cursor-pointer"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="size-5 fill-current" />
          ) : (
            <Play className="size-5 fill-current ml-0.5" />
          )}
        </button>

        <button
          onClick={() => setLiked(!liked)}
          className={`hidden sm:flex size-10 items-center justify-center rounded-full border border-border bg-background/50 transition-colors hover:border-gold ${
            liked ? "text-red-500 border-red-500/50" : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label="Like song"
        >
          <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
        </button>

        <div className="relative hidden sm:block">
          <button
            onClick={handleShare}
            className="flex size-10 items-center justify-center rounded-full border border-border bg-background/50 text-muted-foreground hover:text-foreground hover:border-gold transition-colors"
            aria-label="Share song"
          >
            <Share2 className="size-4" />
          </button>
          {copied && (
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gold text-background text-[0.6rem] font-bold px-1.5 py-0.5 rounded shadow">
              Copied!
            </span>
          )}
        </div>

        <Link
          to={songPath(song.slug)}
          className="flex size-10 items-center justify-center rounded-full border border-border bg-background/50 text-muted-foreground hover:text-gold hover:border-gold transition-colors"
          aria-label="More song info"
        >
          <Info className="size-4" />
        </Link>
      </div>
    </motion.div>
  );
}

export function OriginalTracksSection() {
  const { data: songs, isLoading } = useQuery({
    queryKey: ["original-tracks-playlist"],
    queryFn: () => contentService.getSongs(),
  });

  if (isLoading || !songs || songs.length === 0) return null;

  const playlistSongs = songs.slice(0, 6);

  return (
    <section className="relative py-20 md:py-32 bg-background overflow-hidden">
      {/* Background Image & Atmospheric Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={brandAssets.nebulaBackground}
          alt="Nebula space backdrop"
          className="size-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background/70" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Discography"
            title="Original Tracks Playlist"
            subtitle="Handcrafted original anthems, mantras, and cinematic journeys ready to play."
            align="left"
          />
          <Link
            to={routes.music}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:underline group"
          >
            <span>Full Catalog Navigation</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {playlistSongs.map((song, i) => (
            <OriginalTrackRow key={song.id} song={song} index={i} allSongs={playlistSongs} />
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Link
            to={routes.music}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-8 text-sm font-semibold text-gold hover:bg-gold hover:text-background transition-all shadow-[0_0_25px_rgba(212,175,55,0.2)]"
          >
            <Disc3 className="size-4 animate-[spin_8s_linear_infinite]" />
            Explore Full Music Catalog ({songs.length} Tracks)
          </Link>
        </div>
      </div>
    </section>
  );
}
