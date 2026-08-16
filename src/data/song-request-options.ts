import type { AttachmentKind, SongEmotion, SongRequestOccasion } from "@/types";

/**
 * Choice sets and journey configuration for the "Create Your Song" experience.
 * Editorial data only — no component imports it directly, everything flows
 * through `@/services`-adjacent config so a CMS can own these lists later.
 */

export type OccasionOption = {
  value: SongRequestOccasion;
  label: string;
  description: string;
};

export const occasionOptions: OccasionOption[] = [
  {
    value: "birthday",
    label: "Birthday",
    description: "A track written for someone's year, their name in the chorus.",
  },
  {
    value: "wedding",
    label: "Wedding",
    description: "First dance, entry or vidaai — scored for the whole day.",
  },
  {
    value: "anniversary",
    label: "Anniversary",
    description: "A love story retold in melody, verse by verse.",
  },
  {
    value: "devotional",
    label: "Devotional",
    description: "Chant, aarti or bhajan composed around your prayer.",
  },
  {
    value: "brand",
    label: "Brand / Advertising",
    description: "A sonic identity, jingle or campaign anthem.",
  },
  {
    value: "film",
    label: "Film / Short Film",
    description: "Score, theme or title track cut to your edit.",
  },
  {
    value: "other",
    label: "Something Else",
    description: "A tribute, a farewell, a memory — tell us the moment.",
  },
];

export type EmotionOption = {
  value: SongEmotion;
  label: string;
  description: string;
};

export const emotionOptions: EmotionOption[] = [
  { value: "joyful", label: "Joyful", description: "Bright, celebratory, alive." },
  { value: "romantic", label: "Romantic", description: "Warm, intimate, close." },
  { value: "nostalgic", label: "Nostalgic", description: "Soft, remembering, tender." },
  { value: "devotional", label: "Devotional", description: "Sacred, still, surrendered." },
  { value: "uplifting", label: "Uplifting", description: "Rising, hopeful, open." },
  { value: "epic", label: "Epic", description: "Cinematic, vast, powerful." },
  { value: "peaceful", label: "Peaceful", description: "Ambient, calm, weightless." },
  {
    value: "bittersweet",
    label: "Bittersweet",
    description: "Beautiful and aching at once.",
  },
];

export const budgetOptions = [
  "Under ₹25,000",
  "₹25,000 – ₹75,000",
  "₹75,000 – ₹2,00,000",
  "Above ₹2,00,000",
  "Not sure yet",
];

/** Upload rules shared by the dropzone and the attachment service. */
export const uploadConfig = {
  maxFiles: 6,
  maxFileBytes: 10 * 1024 * 1024,
  accept: "image/*,audio/*,application/pdf",
  acceptedMimePrefixes: ["image/", "audio/"],
  acceptedMimeTypes: ["application/pdf"],
} as const;

export const attachmentKindByMime = (mimeType: string): AttachmentKind => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "audio";
  return "document";
};

/** The ordered journey. `id` values are stable — safe to persist in drafts. */
export const songRequestSteps = [
  {
    id: "occasion",
    title: "The Occasion",
    eyebrow: "Step One",
    subtitle: "What moment are we scoring?",
  },
  {
    id: "story",
    title: "Your Story",
    eyebrow: "Step Two",
    subtitle: "The details that make this song only yours.",
  },
  {
    id: "emotion",
    title: "The Emotion",
    eyebrow: "Step Three",
    subtitle: "How should it feel in the room?",
  },
  {
    id: "language",
    title: "Language",
    eyebrow: "Step Four",
    subtitle: "The voice your song will speak in.",
  },
  {
    id: "genre",
    title: "Genre",
    eyebrow: "Step Five",
    subtitle: "The sound world we'll build it in.",
  },
  {
    id: "references",
    title: "Reference Songs",
    eyebrow: "Step Six",
    subtitle: "Tracks that already sound like your feeling.",
  },
  {
    id: "uploads",
    title: "Inspiration Files",
    eyebrow: "Step Seven",
    subtitle: "Photos, notes, voice memos — anything that helps.",
  },
  {
    id: "contact",
    title: "Contact Details",
    eyebrow: "Step Eight",
    subtitle: "Where we send the first listen.",
  },
  {
    id: "review",
    title: "Review",
    eyebrow: "Step Nine",
    subtitle: "One last read before we begin.",
  },
] as const;

export type SongRequestStepId = (typeof songRequestSteps)[number]["id"];
