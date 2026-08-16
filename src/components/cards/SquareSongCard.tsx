import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Play, Pause } from "lucide-react";
import type { Song } from "@/types";
import { select } from "@/services";
import { songPath } from "@/data/routes";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { songToTrack } from "@/services/audio-player";
import { brandAssets } from "@/data/assets";

export function SquareSongCard({
  song,
  index = 0,
  allSongs,
}: {
  song: Song;
  index?: number;
  allSongs?: Song[];
}) {
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
      if (allSongs && allSongs.length > 0) {
        const { songsToTracks } = await import("@/services/audio-player");
        const allTracks = songsToTracks(allSongs);
        const trackIndex = allTracks.findIndex((t) => t.id === track.id);

        if (trackIndex >= 0) {
          controls.playQueue(allTracks, trackIndex);
          return;
        }
      }

      controls.playQueue([track], 0);
    } catch (error) {
      controls.playQueue([track], 0);
    }
  };

  const coverSrc = song.cover?.src || brandAssets.logo;

  const genreName =
    song.genreIds.length > 0
      ? select.genreById(song.genreIds[0] as string)?.name || song.genreIds[0]
      : "";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      className="group relative flex flex-col gap-3"
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-card border border-border shadow-md transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02] group-hover:border-gold/50 group-hover:shadow-[0_8px_30px_rgb(212,175,55,0.15)]">
        <Link to={songPath(song.slug)} className="absolute inset-0 z-0 block cursor-pointer">
          <img
            src={coverSrc}
            alt={song.cover?.alt || song.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>

        {hasAudio && (
          <button
            onClick={handlePlay}
            aria-label={isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
            className={`absolute bottom-3 right-3 flex items-center justify-center size-10 md:size-12 rounded-full bg-gold text-background shadow-lg shadow-gold/20 transition-all duration-300 z-10 hover:scale-110 hover:bg-white hover:text-black cursor-pointer ${isPlaying ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0"}`}
          >
            {isPlaying ? (
              <Pause className="size-5 md:size-6" fill="currentColor" />
            ) : (
              <Play className="size-5 md:size-6 ml-1" fill="currentColor" />
            )}
          </button>
        )}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none z-20" />
      </div>

      <div className="flex flex-col gap-0.5 px-1">
        <Link
          to={songPath(song.slug)}
          className="truncate font-display text-base md:text-lg leading-tight hover:text-gold transition-colors"
        >
          {song.title}
        </Link>
        {genreName && (
          <p className="truncate text-xs uppercase tracking-widest text-gold/80 mt-1">
            {genreName}
          </p>
        )}
      </div>
    </motion.div>
  );
}
