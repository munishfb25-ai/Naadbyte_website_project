import type { SongRequest, SongRequestOccasion } from "@/types";

/** Options a future "Create Your Song" form will render. */
export const songRequestOccasions: {
  value: SongRequestOccasion;
  label: string;
}[] = [
  { value: "birthday", label: "Birthday" },
  { value: "wedding", label: "Wedding" },
  { value: "anniversary", label: "Anniversary" },
  { value: "brand", label: "Brand / Advertising" },
  { value: "film", label: "Film / Short Film" },
  { value: "devotional", label: "Devotional" },
  { value: "other", label: "Something else" },
];

/** Mock records used for local development of an admin/inbox view. */
export const songRequests: SongRequest[] = [
  {
    id: "req-1",
    name: "Rhea Sharma",
    email: "rhea@example.com",
    occasion: "wedding",
    language: "punjabi",
    genreId: "punjabi",
    brief:
      "A warm, upbeat wedding entry track with dhol and modern production for a 90-second walk-in.",
    status: "in-review",
    createdAt: "2026-04-02",
  },
];
