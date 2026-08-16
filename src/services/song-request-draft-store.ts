import type { SongRequestAttachment, SongRequestDraft, SongRequestInput } from "@/types";

/**
 * Persistence port for an in-progress commission.
 * The local adapter uses `localStorage`; a future adapter can persist to
 * Lovable Cloud / WordPress against the exact same interface.
 */
export type SongRequestDraftStore = {
  load(): SongRequestDraft | null;
  save(draft: SongRequestDraft): void;
  clear(): void;
};

export const DRAFT_VERSION = 1;
const DRAFT_KEY = "naadbyte:create-your-song:draft";

const isBrowser = () => typeof window !== "undefined";

export const localDraftStore: SongRequestDraftStore = {
  load() {
    if (!isBrowser()) return null;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as SongRequestDraft;
      if (parsed.version !== DRAFT_VERSION) return null;
      return parsed;
    } catch {
      return null;
    }
  },
  save(draft) {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* quota exceeded — drafts are best-effort, never block the journey */
    }
  },
  clear() {
    if (!isBrowser()) return;
    window.localStorage.removeItem(DRAFT_KEY);
  },
};

export function createDraft(
  stepIndex: number,
  values: Partial<SongRequestInput>,
): SongRequestDraft {
  return {
    stepIndex,
    values,
    updatedAt: new Date().toISOString(),
    version: DRAFT_VERSION,
  };
}

/**
 * A draft may hold base64 file payloads. Strip them before persisting so a
 * couple of audio memos never blow the storage quota; metadata is kept so the
 * client still sees what they attached when they return.
 */
export function stripHeavyPayloads(values: Partial<SongRequestInput>): Partial<SongRequestInput> {
  if (!values.attachments?.length) return values;
  const attachments: SongRequestAttachment[] = values.attachments.map(
    ({ dataUrl: _dataUrl, ...rest }) => rest,
  );
  return { ...values, attachments };
}
