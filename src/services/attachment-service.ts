import { attachmentKindByMime, uploadConfig } from "@/data/song-request-options";
import type { SongRequestAttachment } from "@/types";

/**
 * Upload port for commission attachments.
 * `localAttachmentService` keeps files in-memory as data URLs (no backend
 * required). A cloud adapter implements the same interface and returns a
 * public/ signed `url` + `storagePath` instead.
 */
export type AttachmentService = {
  upload(file: File): Promise<SongRequestAttachment>;
  remove(attachment: SongRequestAttachment): Promise<void>;
};

export function validateFile(file: File): string | null {
  const okPrefix = uploadConfig.acceptedMimePrefixes.some((p) => file.type.startsWith(p));
  const okExact = (uploadConfig.acceptedMimeTypes as readonly string[]).includes(file.type);
  if (!okPrefix && !okExact) {
    return `${file.name}: only images, audio files and PDFs are supported.`;
  }
  if (file.size > uploadConfig.maxFileBytes) {
    return `${file.name}: files must be under ${Math.round(
      uploadConfig.maxFileBytes / (1024 * 1024),
    )}MB.`;
  }
  return null;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

export const localAttachmentService: AttachmentService = {
  async upload(file) {
    const dataUrl = await readAsDataUrl(file);
    return {
      id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      kind: attachmentKindByMime(file.type),
      dataUrl,
      uploadedAt: new Date().toISOString(),
    };
  },
  async remove() {
    /* nothing to revoke for data URLs */
  },
};

export const attachmentService: AttachmentService = localAttachmentService;

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
