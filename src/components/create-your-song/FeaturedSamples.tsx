import { motion } from "framer-motion";
import { Play, Pause, Volume2, Sparkles } from "lucide-react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { songToTrack } from "@/services/audio-player";
import { songs } from "@/data/songs";
import type { Song } from "@/types";

interface SampleSongConfig {
  song: Song;
  occasionTag: string;
  moodDescription: string;
}

export function FeaturedSamples() {
  const { currentTrack, status, controls } = useAudioPlayer();

  // Curate 4 diverse bespoke sample tracks from the catalog
  const sampleTracks: SampleSongConfig[] = [
    {
      song: songs.find((s) => s.slug === "shiva-within") || songs[0],
      occasionTag: "Spiritual & Devotional",
      moodDescription: "Traditional Indian classical instrumentation with ambient sacred chants.",
    },
    {
      song: songs.find((s) => s.slug === "echoes-of-naad") || songs[1],
      occasionTag: "Cinematic & Romance",
      moodDescription: "Lush orchestral strings, emotional acoustic melody, and cinematic depth.",
    },
    {
      song: songs.find((s) => s.slug === "rise-again") || songs[3] || songs[0],
      occasionTag: "Milestone & Inspiration",
      moodDescription:
        "High-energy contemporary instrumentation for life triumphs and personal stories.",
    },
    {
      song: songs.find((s) => s.slug === "neon-mantra") || songs[2],
      occasionTag: "Modern Celebration",
      moodDescription:
        "Electronic fusion blending ancient verses with driving, celebratory rhythm.",
    },
  ];

  const handleToggle = (song: Song) => {
    const track = songToTrack(song);
    if (!track) return;

    if (currentTrack?.id === track.id) {
      controls.toggle();
      return;
    }

    const allTracks = sampleTracks
      .map((st) => songToTrack(st.song))
      .filter((t): t is NonNullable<typeof t> => t !== null);

    const index = allTracks.findIndex((t) => t.id === track.id);
    if (index >= 0) {
      controls.playQueue(allTracks, index);
    } else {
      controls.playQueue([track], 0);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section className="relative w-full py-16 md:py-24 border-t border-border/40">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-12">
          <span className="eyebrow flex items-center gap-2">
            <Sparkles className="size-3.5 text-gold" />
            Sample Compositions
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-balance">
            Hear the Standard of Sound
          </h2>
          <p className="max-w-xl text-sm md:text-base text-muted-foreground text-pretty">
            Listen to the depth, live vocal performance, and label-grade mastering we bring to every
            bespoke song.
          </p>
        </div>

        {/* 4 Sample Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleTracks.map(({ song, occasionTag, moodDescription }, idx) => {
            const track = songToTrack(song);
            const isPlaying =
              currentTrack?.id === song.id && (status === "playing" || status === "loading");

            return (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                className={`glass-panel group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 border transition-all duration-300 ${
                  isPlaying
                    ? "border-gold/60 shadow-[0_0_30px_rgba(212,160,23,0.15)] bg-gold/5"
                    : "border-border/60 hover:border-gold/40 hover:bg-white/[0.02]"
                }`}
              >
                <div>
                  {/* Artwork & Play overlay */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted/30 mb-4">
                    {song.cover?.src && (
                      <img
                        src={song.cover.src}
                        alt={song.cover.alt || song.title}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Floating Play/Pause Button */}
                    <button
                      type="button"
                      onClick={() => handleToggle(song)}
                      aria-label={isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
                      className={`absolute bottom-3 right-3 flex size-12 items-center justify-center rounded-full transition-all duration-200 shadow-xl cursor-pointer ${
                        isPlaying
                          ? "bg-gold text-background scale-105 glow-gold"
                          : "bg-background/90 text-gold hover:bg-gold hover:text-background hover:scale-110 border border-gold/40"
                      }`}
                    >
                      {isPlaying ? (
                        <Pause className="size-5 fill-current" />
                      ) : (
                        <Play className="size-5 fill-current ml-0.5" />
                      )}
                    </button>

                    {/* Live playing badge */}
                    {isPlaying && (
                      <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-gold/90 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-background shadow-lg backdrop-blur-md">
                        <Volume2 className="size-3 animate-pulse" />
                        Playing
                      </span>
                    )}
                  </div>

                  {/* Occasion / Tag */}
                  <span className="inline-block text-[0.65rem] uppercase tracking-widest font-semibold text-gold/90 mb-1.5">
                    {occasionTag}
                  </span>

                  {/* Title & Duration */}
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <h3 className="font-display text-xl leading-tight font-medium text-foreground">
                      {song.title}
                    </h3>
                    <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                      {formatDuration(song.durationSeconds)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed">{moodDescription}</p>
                </div>

                {/* Animated Waveform Indicator when playing */}
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                  <div className="flex items-end gap-1 h-3.5">
                    {[40, 75, 55, 95, 60, 80, 45, 90, 70].map((h, i) => (
                      <span
                        key={i}
                        className={`w-0.5 rounded-full transition-all duration-300 ${
                          isPlaying ? "bg-gold animate-pulse" : "bg-muted-foreground/30"
                        }`}
                        style={{
                          height: isPlaying ? `${h}%` : "30%",
                          animationDelay: `${i * 120}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground/80">
                    Studio Master
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
