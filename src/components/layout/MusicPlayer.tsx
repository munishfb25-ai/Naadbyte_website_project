import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { formatDuration } from "@/lib/utils";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function MusicPlayer() {
  const { status, currentTrack, currentTime, duration, volume, muted, queue, controls, error } =
    useAudioPlayer();
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);

  // Prevent hydration mismatch or showing player when empty
  if (queue.length === 0 || !currentTrack) return null;

  const isPlaying = status === "playing" || status === "loading";
  const displayTime = isDragging ? dragTime : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setDragTime(val);
  };

  const handleSeekEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging) {
      controls.seek(dragTime);
      setIsDragging(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-between border-t border-white/10 bg-background/95 px-4 backdrop-blur-xl md:px-8"
      >
        {/* Track Info (Left) */}
        <div className="flex w-1/3 min-w-0 items-center gap-3 md:gap-4">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-md md:size-14">
            {currentTrack.cover ? (
              <img
                src={currentTrack.cover.src}
                alt={currentTrack.cover.alt}
                className="size-full object-cover"
              />
            ) : (
              <div className="size-full bg-white/5" />
            )}
          </div>
          <div className="min-w-0 flex-col justify-center">
            <h4 className="truncate text-sm font-semibold text-foreground md:text-base">
              {currentTrack.title}
            </h4>
            {currentTrack.artist && (
              <p className="truncate text-xs text-muted-foreground md:text-sm">
                {currentTrack.artist}
              </p>
            )}
          </div>
        </div>

        {/* Playback Controls & Progress (Center) */}
        <div className="flex w-1/3 max-w-md flex-col items-center justify-center gap-1.5 px-2">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => controls.previous()}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Previous track"
            >
              <SkipBack className="size-5" />
            </button>
            <button
              onClick={() => controls.toggle()}
              className="flex size-10 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="size-5 fill-background" />
              ) : (
                <Play className="size-5 fill-background ml-0.5" />
              )}
            </button>
            <button
              onClick={() => controls.next()}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Next track"
            >
              <SkipForward className="size-5" />
            </button>
          </div>
          <div className="hidden w-full items-center gap-2 md:flex">
            {error ? (
              <div className="flex-1 text-center text-xs text-red-400">
                Audio source not available
              </div>
            ) : (
              <>
                <span className="w-10 text-right text-xs text-muted-foreground">
                  {formatDuration(displayTime)}
                </span>
                <div className="group relative flex h-4 flex-1 items-center">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={displayTime}
                    onChange={handleSeek}
                    onMouseDown={() => setIsDragging(true)}
                    onTouchStart={() => setIsDragging(true)}
                    onMouseUp={handleSeekEnd}
                    onTouchEnd={handleSeekEnd}
                    className="absolute z-10 w-full opacity-0 cursor-pointer"
                  />
                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-gold transition-all duration-100 ease-linear"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
                <span className="w-10 text-left text-xs text-muted-foreground">
                  {formatDuration(duration)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Volume & Extras (Right) */}
        <div className="hidden w-1/3 items-center justify-end gap-2 md:flex">
          <button
            onClick={() => controls.setMuted(!muted)}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted || volume === 0 ? (
              <VolumeX className="size-5" />
            ) : (
              <Volume2 className="size-5" />
            )}
          </button>
          <div className="group relative flex h-4 w-24 items-center">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => {
                controls.setMuted(false);
                controls.setVolume(Number(e.target.value));
              }}
              className="absolute z-10 w-full opacity-0 cursor-pointer"
            />
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-foreground transition-all duration-100 ease-linear"
                style={{ width: `${muted ? 0 : volume * 100}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
