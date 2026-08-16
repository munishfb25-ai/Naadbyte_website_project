import { useSyncExternalStore } from "react";

import { audioPlayerStore, controls } from "@/services/audio-player";
import type { AudioPlayerControls, AudioPlayerState } from "@/types";

/**
 * Read the global audio player state and its controls.
 * No provider needs to be mounted — the store lives in the service layer.
 */
export function useAudioPlayer(): AudioPlayerState & { controls: AudioPlayerControls } {
  const state = useSyncExternalStore(
    audioPlayerStore.subscribe,
    audioPlayerStore.getSnapshot,
    audioPlayerStore.getServerSnapshot,
  );
  return { ...state, controls };
}
