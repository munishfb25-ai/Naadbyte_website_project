import type { AudioPlayerControls, AudioPlayerState, AudioTrack, Song } from "@/types";

/**
 * Framework-agnostic audio player service.
 *
 * A single module-level store wraps one `HTMLAudioElement`, so any component
 * can read state (via `useAudioPlayer`) or drive playback without a provider
 * being mounted. Audio files are always referenced by URL — nothing is
 * bundled into the app.
 *
 * The store is SSR-safe: the `Audio` element is created lazily in the browser.
 */

const initialState: AudioPlayerState = {
  status: "idle",
  queue: [],
  index: -1,
  currentTrack: null,
  currentTime: 0,
  duration: 0,
  volume: 1,
  muted: false,
  error: null,
};

let state: AudioPlayerState = initialState;
const listeners = new Set<() => void>();

function setState(patch: Partial<AudioPlayerState>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

let element: HTMLAudioElement | null = null;

function audio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (element) return element;

  element = new window.Audio();
  element.preload = "metadata";
  element.volume = state.volume;

  element.addEventListener("loadedmetadata", () =>
    setState({ duration: Number.isFinite(element!.duration) ? element!.duration : 0 }),
  );
  element.addEventListener("timeupdate", () => setState({ currentTime: element!.currentTime }));
  element.addEventListener("play", () => setState({ status: "playing", error: null }));
  element.addEventListener("playing", () => setState({ status: "playing", error: null }));
  element.addEventListener("pause", () => {
    if (state.status !== "idle") setState({ status: "paused" });
  });
  element.addEventListener("waiting", () => setState({ status: "loading" }));
  element.addEventListener("ended", () => controls.next());
  element.addEventListener("error", () =>
    setState({ status: "error", error: "This track could not be played." }),
  );

  return element;
}

function load(index: number, autoPlay: boolean) {
  const track = state.queue[index];
  const el = audio();
  if (!track || !el) return;

  setState({
    index,
    currentTrack: track,
    currentTime: 0,
    duration: 0,
    error: null,
    status: "loading",
  });
  if (el.src !== track.src) el.src = track.src;
  if (autoPlay)
    void el.play().catch(() => setState({ status: "error", error: "Playback blocked." }));
}

export const controls: AudioPlayerControls = {
  play(track) {
    if (track) {
      const existing = state.queue.findIndex((item) => item.id === track.id);
      if (existing >= 0) {
        load(existing, true);
        return;
      }
      setState({ queue: [...state.queue, track] });
      load(state.queue.length - 1, true);
      return;
    }
    if (state.index >= 0) void audio()?.play();
  },

  playQueue(queue, startIndex = 0) {
    setState({ queue });
    load(startIndex, true);
  },

  pause() {
    audio()?.pause();
    setState({ status: "paused" });
  },

  toggle(track) {
    const isCurrent = track ? state.currentTrack?.id === track.id : state.index >= 0;

    // Check actual DOM state if element exists, otherwise fall back to our status
    const isActuallyPlaying = element
      ? !element.paused
      : state.status === "playing" || state.status === "loading";

    if (isCurrent && isActuallyPlaying) {
      controls.pause();
      return;
    }
    controls.play(track);
  },

  stop() {
    const el = audio();
    if (el) {
      el.pause();
      el.removeAttribute("src");
    }
    setState({ ...initialState, volume: state.volume, muted: state.muted });
  },

  next() {
    if (state.index + 1 < state.queue.length) load(state.index + 1, true);
    else controls.stop();
  },

  previous() {
    if (state.index > 0) load(state.index - 1, true);
    else controls.seek(0);
  },

  seek(seconds) {
    const el = audio();
    if (el) el.currentTime = seconds;
    setState({ currentTime: seconds });
  },

  setVolume(volume) {
    const clamped = Math.min(1, Math.max(0, volume));
    const el = audio();
    if (el) el.volume = clamped;
    setState({ volume: clamped });
  },

  setMuted(muted) {
    const el = audio();
    if (el) el.muted = muted;
    setState({ muted });
  },
};

export const audioPlayerStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => state,
  getServerSnapshot: () => initialState,
  controls,
};

/** Adapt a catalogue `Song` to an `AudioTrack`. Returns null without audio. */
export function songToTrack(song: Song, artist?: string): AudioTrack | null {
  if (!song.audioUrl) return null;
  return {
    id: song.id,
    title: song.title,
    src: song.audioUrl,
    cover: song.cover,
    durationSeconds: song.durationSeconds,
    ...(artist ? { artist } : {}),
  };
}

/** Adapt a list of songs, skipping any without a hosted audio URL. */
export function songsToTracks(songs: Song[], artist?: string): AudioTrack[] {
  return songs
    .map((song) => songToTrack(song, artist))
    .filter((track): track is AudioTrack => track !== null);
}
