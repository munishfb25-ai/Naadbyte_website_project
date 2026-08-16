import type { ID, ISODate, Language } from "./common";

export type SongRequestOccasion =
  "birthday" | "wedding" | "anniversary" | "brand" | "film" | "devotional" | "other";

export type SongRequestStatus = "new" | "in-review" | "in-production" | "delivered" | "cancelled";

/** Emotional direction of the commission — drives arrangement and lyrics. */
export type SongEmotion =
  | "joyful"
  | "romantic"
  | "nostalgic"
  | "devotional"
  | "uplifting"
  | "epic"
  | "peaceful"
  | "bittersweet";

/** A track the client points to as a tonal reference. */
export type ReferenceSong = {
  id: ID;
  title: string;
  artist?: string;
  url?: string;
  note?: string;
};

export type AttachmentKind = "image" | "audio" | "document";

/**
 * An uploaded file attached to a commission.
 * `dataUrl` is used by the local (no-backend) storage adapter; a cloud adapter
 * fills `url` + `storagePath` instead. Consumers should prefer `url ?? dataUrl`.
 */
export type SongRequestAttachment = {
  id: ID;
  name: string;
  mimeType: string;
  sizeBytes: number;
  kind: AttachmentKind;
  dataUrl?: string;
  url?: string;
  storagePath?: string;
  uploadedAt?: ISODate;
};

/**
 * "Create Your Song" — a bespoke music commission request.
 *
 * Fields added for the multi-step journey are optional so every existing
 * consumer (mock data, provider, admin views) keeps compiling unchanged.
 * Integration slots (`ai`, `crm`, `payment`, `cms`) let AI lyric generation,
 * a CRM, a payment gateway and WordPress attach without a model rewrite.
 */
export type SongRequest = {
  id: ID;
  name: string;
  email: string;
  phone?: string;
  occasion: SongRequestOccasion;
  /** Free-text detail when `occasion` is "other". */
  occasionDetail?: string;
  language: Language;
  /** Preferred genre — references `Genre.id`. */
  genreId?: ID;
  /** Free-form brief from the client. */
  brief: string;
  /** The long-form story behind the commission (step 2 of the journey). */
  story?: string;
  /** Who/what the song is for. */
  dedicatedTo?: string;
  /** Emotional direction — one or more `SongEmotion`s. */
  emotions?: SongEmotion[];
  /** Named people, places or phrases to weave into the lyrics. */
  keyMoments?: string;
  referenceTrackUrl?: string;
  referenceSongs?: ReferenceSong[];
  attachments?: SongRequestAttachment[];
  budget?: string;
  deadline?: ISODate;
  /** Where the request came from — wizard, phone, partner, import… */
  source?: string;
  status: SongRequestStatus;
  createdAt?: ISODate;
  updatedAt?: ISODate;

  /** Future integrations — populated by adapters, never by the UI. */
  ai?: {
    lyricsDraft?: string;
    moodBoardPrompt?: string;
    generatedAt?: ISODate;
  };
  crm?: { contactId?: string; dealId?: string; syncedAt?: ISODate };
  payment?: {
    provider?: string;
    checkoutId?: string;
    amount?: number;
    currency?: string;
    status?: "unpaid" | "pending" | "paid" | "refunded";
  };
  cms?: { postId?: number | string; permalink?: string };
};

/** Payload accepted by the submission port (server-generated fields omitted). */
export type SongRequestInput = Omit<
  SongRequest,
  "id" | "status" | "createdAt" | "updatedAt" | "ai" | "crm" | "payment" | "cms"
>;

/** An in-progress commission held locally until the client submits. */
export type SongRequestDraft = {
  /** Index of the step the client was last on. */
  stepIndex: number;
  values: Partial<SongRequestInput>;
  updatedAt: ISODate;
  /** Schema version so future migrations can upgrade old drafts safely. */
  version: number;
};
