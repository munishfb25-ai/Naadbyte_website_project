import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Play, Pause, Heart, Share2, Info, ArrowRight, ExternalLink } from "lucide-react";
import { contentService, select } from "@/services";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { songToTrack, songsToTracks } from "@/services/audio-player";
import { brandAssets } from "@/data/assets";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Link } from "@tanstack/react-router";
import { songPath, routes } from "@/data/routes";
import { formatDuration } from "@/lib/utils";
import { useState } from "react";

export function LatestReleases() {
  const {
    data: songs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["latest-release-single"],
    queryFn: () => contentService.getSongs(),
  });

  const { currentTrack, status, controls } = useAudioPlayer();
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isLoading || isError || !songs || songs.length === 0) {
    return null;
  }

  // Sort by releaseDate descending to get the absolute newest song
  const sortedSongs = [...songs].sort((a, b) => {
    return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
  });

  const latestSong = sortedSongs[0];
  const track = songToTrack(latestSong);
  const isPlaying =
    currentTrack?.id === latestSong.id && (status === "playing" || status === "loading");

  const handlePlay = () => {
    if (!track) return;
    if (currentTrack?.id === track.id) {
      controls.toggle();
    } else {
      const allTracks = songsToTracks(sortedSongs);
      const idx = allTracks.findIndex((t) => t.id === track.id);
      if (idx >= 0) {
        controls.playQueue(allTracks, idx);
      } else {
        controls.playQueue([track], 0);
      }
    }
  };

  const coverSrc = latestSong.cover?.src || brandAssets.logo;
  const artistName = latestSong.artistIds.map((id) => select.artistById(id)?.name || id).join(", ");
  const genreName =
    latestSong.genreIds.length > 0
      ? select.genreById(latestSong.genreIds[0] as string)?.name || latestSong.genreIds[0]
      : latestSong.language || "Original";

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + songPath(latestSong.slug));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="latest-release" className="relative py-20 md:py-32 bg-background overflow-hidden">
      {/* Background Image & Immersive Atmospheric Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Ken Burns Slow Zoom Background Image */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], x: [0, 10, 0], y: [0, -5, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 size-full"
        >
          <img
            src={brandAssets.latestReleaseSunrise}
            alt="Latest release backdrop"
            className="size-full object-cover opacity-60"
          />
        </motion.div>

        {/* Slow-Moving Nebula Clouds & Drifting Fog */}
        <motion.div
          animate={{ x: ["-10%", "10%", "-10%"], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/20 via-transparent to-transparent blur-3xl"
        />

        <motion.div
          animate={{ x: ["5%", "-5%", "5%"], y: ["-3%", "3%", "-3%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(212,175,55,0.15)_0%,_transparent_70%)] blur-2xl"
        />

        {/* Soft Golden Glow That Gently Pulses */}
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/3 size-[500px] rounded-full bg-gold/20 blur-[120px]"
        />

        {/* Shifting Warm Light Rays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-background/50 to-background/70 backdrop-blur-[1px]" />

        {/* Twinkling Star Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0.1, 1, 0.1],
                scale: [0.8, 1.3, 0.8],
              }}
              transition={{
                duration: 2 + (i % 4),
                repeat: Infinity,
                delay: (i * 0.3) % 3,
                ease: "easeInOut",
              }}
              className="absolute rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]"
              style={{
                top: `${(i * 17) % 90}%`,
                left: `${(i * 23) % 95}%`,
                width: `${(i % 3) + 2}px`,
                height: `${(i % 3) + 2}px`,
              }}
            />
          ))}
        </div>

        {/* Subtle Waveform Glow at the Bottom */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-gold/15 via-gold/5 to-transparent flex items-end justify-around px-4 opacity-70 pointer-events-none">
          {Array.from({ length: 32 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height: ["15px", `${20 + ((i * 7) % 35)}px`, "15px"],
              }}
              transition={{
                duration: 1.2 + (i % 5) * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.05,
              }}
              className="w-1.5 rounded-full bg-gold/40 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <SectionHeading eyebrow="New Release" title="Latest Release" align="left" />
          <Link
            to={routes.releases}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:underline group"
          >
            <span>More Releases</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Single Latest Release Featured Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-gold/30 bg-card/70 backdrop-blur-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] grid lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-12"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-32 -right-32 size-[450px] rounded-full bg-gold/15 blur-3xl pointer-events-none" />

          {/* Artwork Column (5 cols) */}
          <div className="lg:col-span-5 relative group">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gold/40 shadow-2xl">
              <img
                src={coverSrc}
                alt={latestSong.cover?.alt || latestSong.title}
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />

              {/* Play Overlay Button */}
              <button
                onClick={handlePlay}
                className="absolute inset-0 m-auto flex size-20 items-center justify-center rounded-full bg-gold text-background shadow-[0_0_35px_rgba(212,175,55,0.6)] transition-transform duration-300 hover:scale-110 cursor-pointer"
                aria-label={isPlaying ? "Pause track" : "Play track"}
              >
                {isPlaying ? (
                  <Pause className="size-8" fill="currentColor" />
                ) : (
                  <Play className="size-8 ml-1" fill="currentColor" />
                )}
              </button>
            </div>
          </div>

          {/* Details Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-6">
            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-semibold uppercase tracking-wider text-gold">
              <span>{latestSong.language || "Original"}</span>
              <span>•</span>
              <span>{genreName}</span>
              {latestSong.durationSeconds > 0 && (
                <>
                  <span>•</span>
                  <span>{formatDuration(latestSong.durationSeconds)}</span>
                </>
              )}
            </div>

            <div>
              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-2">
                {latestSong.title}
              </h3>
              <p className="text-base sm:text-lg font-medium text-muted-foreground">{artistName}</p>
            </div>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-3">
              {latestSong.description ||
                latestSong.story ||
                "An immersive original composition crafted with pristine production, rich harmonic textures, and unforgettable vocal depth."}
            </p>

            {/* Streaming & Social Links */}
            {latestSong.streamingLinks && latestSong.streamingLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="text-xs uppercase tracking-wider text-muted-foreground mr-1">
                  Stream:
                </span>
                {latestSong.streamingLinks.slice(0, 4).map((link) => (
                  <a
                    key={link.platform}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border bg-background/50 text-xs font-medium text-foreground hover:border-gold hover:text-gold transition-colors"
                  >
                    <ExternalLink className="size-3" />
                    <span className="capitalize">{link.platform}</span>
                  </a>
                ))}
              </div>
            )}

            {/* Action Bar: Play, More Info, Like, Share */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border/60">
              <button
                onClick={handlePlay}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-8 text-sm font-bold text-background transition-transform hover:scale-105 shadow-lg shadow-gold/20 cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="size-4" fill="currentColor" /> Pause Song
                  </>
                ) : (
                  <>
                    <Play className="size-4" fill="currentColor" /> Play Now
                  </>
                )}
              </button>

              <Link
                to={songPath(latestSong.slug)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-gold/40 bg-background/50 px-8 text-sm font-semibold text-foreground hover:bg-gold/10 hover:border-gold transition-all"
              >
                <Info className="size-4 text-gold" /> More Info
              </Link>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex size-11 items-center justify-center rounded-full border border-border bg-background/50 transition-colors hover:border-gold ${
                    liked
                      ? "text-red-500 border-red-500/50"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Like song"
                >
                  <Heart className={`size-5 ${liked ? "fill-current" : ""}`} />
                </button>

                <div className="relative">
                  <button
                    onClick={handleShare}
                    className="flex size-11 items-center justify-center rounded-full border border-border bg-background/50 text-muted-foreground hover:text-foreground hover:border-gold transition-colors"
                    aria-label="Share song"
                  >
                    <Share2 className="size-5" />
                  </button>
                  {copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gold text-background text-[0.65rem] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                      Link Copied!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
