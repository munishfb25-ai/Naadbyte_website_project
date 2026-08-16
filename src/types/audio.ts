import type { ID, ImageRef } from "./common";

/**
 * A track handed to the audio player. Deliberately minimal so any source
 * (local catalogue, WordPress, a future API) can produce one.
 * `src` is always a remote URL — audio files are never bundled into the app.
 */
export type AudioTrack = {
  id: ID;
  title: string;
  /** Absolute or site-relative URL to an MP3 / streaming file. */
  src: string;
  artist?: string;
  albumTitle?: string;
  cover?: ImageRef;
  durationSeconds?: number;
};

export type AudioPlayerStatus = "idle" | "loading" | "playing" | "paused" | "error";

/** Serialisable snapshot of the player, consumed by any UI. */
export type AudioPlayerState = {
  status: AudioPlayerStatus;
  /** Ordered playback queue. */
  queue: AudioTrack[];
  /** Index into `queue`, or -1 when nothing is loaded. */
  index: number;
  currentTrack: AudioTrack | null;
  /** Seconds. */
  currentTime: number;
  duration: number;
  /** 0–1. */
  volume: number;
  muted: boolean;
  error: string | null;
};

/** Imperative controls exposed by the player service. */
export type AudioPlayerControls = {
  play(track?: AudioTrack): void;
  playQueue(queue: AudioTrack[], startIndex?: number): void;
  pause(): void;
  toggle(track?: AudioTrack): void;
  stop(): void;
  next(): void;
  previous(): void;
  seek(seconds: number): void;
  setVolume(volume: number): void;
  setMuted(muted: boolean): void;
};
