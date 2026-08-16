import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats a track length in seconds as `m:ss`. */
export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = `${seconds % 60}`.padStart(2, "0");
  return `${m}:${s}`;
}
