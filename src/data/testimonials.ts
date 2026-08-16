import type { Testimonial } from "@/types";

/** Future-ready: no section consumes this yet. */
export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    slug: "aarav-mehta",
    author: "Aarav Mehta",
    role: "Film Director",
    quote:
      "NaadByte scored our short film in a week. The cue they wrote carried the entire final act.",
    rating: 5,
    order: 1,
    status: "published",
  },
  {
    id: "t-2",
    slug: "simran-kaur",
    author: "Simran Kaur",
    role: "Listener",
    quote:
      "Their devotional record is the only thing I play in the morning now. It genuinely changes the day.",
    rating: 5,
    order: 2,
    status: "published",
  },
];
