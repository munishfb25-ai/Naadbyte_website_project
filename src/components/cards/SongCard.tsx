import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Play, Pause } from "lucide-react";
import type { Song } from "@/types";
import { select } from "@/services";
import { songPath } from "@/data/routes";
import { PlatformIcon } from "@/components/common/PlatformIcon";
import { formatDuration } from "@/lib/utils";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { songToTrack } from "@/services/audio-player";

export function SongCard({ song, index = 0 }: { song: Song; index?: number }) {
  const { currentTrack, status, controls } = useAudioPlayer();
  const track = songToTrack(song);

  const isPlaying = currentTrack?.id === song.id && (status === "playing" || status === "loading");
  const hasAudio = !!track;

  const handlePlay = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!track) return;

    if (currentTrack?.id === track.id) {
      controls.toggle();
      return;
    }

    try {
      const { contentService } = await import("@/services");
      const { songsToTracks } = await import("@/services/audio-player");

      const allSongs = await contentService.getSongs();
      const allTracks = songsToTracks(allSongs);
      const trackIndex = allTracks.findIndex((t) => t.id === track.id);

      if (trackIndex >= 0) {
        controls.playQueue(allTracks, trackIndex);
      } else {
        controls.playQueue([track], 0);
      }
    } catch (error) {
      controls.playQueue([track], 0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-deep transition-all duration-500 hover:-translate-y-1 hover:border-gold/40"
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
        <Link
          to={songPath(song.slug)}
          className="absolute inset-0 z-0 block"
          aria-label={`View details for ${song.title}`}
        >
          <img
            src={song.cover.src}
            alt={song.cover.alt}
            loading="lazy"
            width={128}
            height={128}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        {hasAudio && (
          <button
            onClick={handlePlay}
            aria-label={isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
            className={`absolute inset-0 m-auto flex size-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all duration-300 z-10 hover:bg-black/80 hover:scale-110 cursor-pointer ${isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          >
            {isPlaying ? (
              <Pause className="size-4 text-gold" aria-hidden />
            ) : (
              <Play className="size-4 text-gold ml-0.5" aria-hidden />
            )}
          </button>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          to={songPath(song.slug)}
          className="truncate font-display text-xl leading-none hover:text-gold transition-colors"
        >
          {song.title}
        </Link>
        <p className="truncate text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {song.genreIds.map((id) => select.genreById(id)?.name ?? id).join(" · ")}
        </p>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        {song.streamingLinks.slice(0, 3).map((link) => (
          <a
            key={link.platform}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Listen on ${link.platform}`}
            className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
          >
            <PlatformIcon platform={link.platform} className="size-3.5" />
          </a>
        ))}
      </div>

      <span className="shrink-0 text-xs text-muted-foreground">
        {formatDuration(song.durationSeconds)}
      </span>
    </motion.div>
  );
}
