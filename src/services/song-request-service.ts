import type { SongRequest, SongRequestInput } from "@/types";
import { contentService } from "./content-service";

/**
 * "Create Your Song" submission port.
 * Swap the implementation for a server function / CMS endpoint later —
 * callers keep the same signature.
 */
export const songRequestService = {
  submit(input: SongRequestInput): Promise<SongRequest> {
    return contentService.submitSongRequest(input);
  },
  list(): Promise<SongRequest[]> {
    return contentService.getSongRequests();
  },
};
