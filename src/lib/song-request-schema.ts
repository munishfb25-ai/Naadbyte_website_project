import { z } from "zod";
import type { SongRequestInput } from "@/types";
import { songRequestSteps, type SongRequestStepId } from "@/data/song-request-options";

/**
 * Per-step validation. Each step validates only its own slice so the wizard can
 * gate "Continue" without forcing later fields, while `songRequestSchema`
 * validates the whole payload before submission.
 */

const occasionValues = [
  "birthday",
  "wedding",
  "anniversary",
  "brand",
  "film",
  "devotional",
  "other",
] as const;

const languageValues = ["hindi", "english", "punjabi", "instrumental"] as const;

const emotionValues = [
  "joyful",
  "romantic",
  "nostalgic",
  "devotional",
  "uplifting",
  "epic",
  "peaceful",
  "bittersweet",
] as const;

export const occasionStepSchema = z
  .object({
    occasion: z.enum(occasionValues, {
      errorMap: () => ({ message: "Choose the occasion for your song." }),
    }),
    occasionDetail: z.string().trim().max(200).optional(),
  })
  .refine((v) => v.occasion !== "other" || Boolean(v.occasionDetail?.length), {
    message: "Tell us briefly what the occasion is.",
    path: ["occasionDetail"],
  });

export const storyStepSchema = z.object({
  story: z
    .string()
    .trim()
    .min(40, "Give us at least a couple of sentences — detail becomes melody.")
    .max(4000, "Please keep the story under 4000 characters."),
  dedicatedTo: z.string().trim().max(120).optional(),
  keyMoments: z.string().trim().max(1000).optional(),
});

export const emotionStepSchema = z.object({
  emotions: z
    .array(z.enum(emotionValues))
    .min(1, "Pick at least one emotion.")
    .max(3, "Choose up to three so the arrangement stays focused."),
});

export const languageStepSchema = z.object({
  language: z.enum(languageValues, {
    errorMap: () => ({ message: "Choose a language for your song." }),
  }),
});

export const genreStepSchema = z.object({
  genreId: z.string().trim().min(1, "Choose a genre direction."),
});

export const referenceSongSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, "Add a track title.").max(160),
  artist: z.string().trim().max(160).optional(),
  url: z
    .string()
    .trim()
    .url("Enter a valid link (https://…)")
    .max(500)
    .optional()
    .or(z.literal("")),
  note: z.string().trim().max(300).optional(),
});

export const referencesStepSchema = z.object({
  referenceSongs: z.array(referenceSongSchema).max(5, "Up to five references."),
});

export const uploadsStepSchema = z.object({
  attachments: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        mimeType: z.string(),
        sizeBytes: z.number(),
        kind: z.enum(["image", "audio", "document"]),
        dataUrl: z.string().optional(),
        url: z.string().optional(),
        storagePath: z.string().optional(),
        uploadedAt: z.string().optional(),
      }),
    )
    .max(6, "Up to six files."),
});

export const contactStepSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "Name must be under 100 characters."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(255, "Email must be under 255 characters."),
  phone: z
    .string()
    .trim()
    .max(30, "Phone must be under 30 characters.")
    .optional()
    .or(z.literal("")),
  budget: z.string().trim().max(60).optional(),
  deadline: z.string().trim().max(40).optional(),
});

export const reviewStepSchema = z.object({});

/** Full payload validated immediately before submission. */
export const songRequestSchema = occasionStepSchema
  .innerType()
  .merge(storyStepSchema)
  .merge(emotionStepSchema)
  .merge(languageStepSchema)
  .merge(genreStepSchema)
  .merge(referencesStepSchema)
  .merge(uploadsStepSchema)
  .merge(contactStepSchema);

const schemaByStepId: Record<SongRequestStepId, z.ZodTypeAny> = {
  occasion: occasionStepSchema,
  story: storyStepSchema,
  emotion: emotionStepSchema,
  language: languageStepSchema,
  genre: genreStepSchema,
  references: referencesStepSchema,
  uploads: uploadsStepSchema,
  contact: contactStepSchema,
  review: reviewStepSchema,
};

export type FieldErrors = Partial<Record<string, string>>;

/** Validates one step and returns field-keyed messages (empty = valid). */
export function validateStep(
  stepId: SongRequestStepId,
  values: Partial<SongRequestInput>,
): FieldErrors {
  const result = schemaByStepId[stepId].safeParse(values);
  if (result.success) return {};
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? stepId);
    errors[key] ??= issue.message;
  }
  return errors;
}

/** True when every step up to (and including) `index` validates. */
export function isStepComplete(index: number, values: Partial<SongRequestInput>): boolean {
  const step = songRequestSteps[index];
  if (!step) return false;
  return Object.keys(validateStep(step.id, values)).length === 0;
}

export function validateAll(values: Partial<SongRequestInput>): FieldErrors {
  const result = songRequestSchema.safeParse(values);
  if (result.success) return {};
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}
