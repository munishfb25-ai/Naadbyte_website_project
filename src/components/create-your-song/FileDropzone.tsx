import { useRef, useState } from "react";
import { FileAudio, FileText, ImageIcon, Loader2, UploadCloud, X } from "lucide-react";
import { uploadConfig } from "@/data/song-request-options";
import { attachmentService, formatBytes, validateFile } from "@/services";
import type { SongRequestAttachment } from "@/types";
import { cn } from "@/lib/utils";

const iconByKind = {
  image: ImageIcon,
  audio: FileAudio,
  document: FileText,
} as const;

/** Drag-and-drop uploader for images, audio and PDFs. */
export function FileDropzone({
  attachments,
  onChange,
}: {
  attachments: SongRequestAttachment[];
  onChange: (next: SongRequestAttachment[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const incoming = Array.from(fileList);
    const problems: string[] = [];
    const room = uploadConfig.maxFiles - attachments.length;
    if (room <= 0) {
      setMessages([`You can attach up to ${uploadConfig.maxFiles} files.`]);
      return;
    }
    setBusy(true);
    const accepted: SongRequestAttachment[] = [];
    for (const file of incoming.slice(0, room)) {
      const problem = validateFile(file);
      if (problem) {
        problems.push(problem);
        continue;
      }
      try {
        accepted.push(await attachmentService.upload(file));
      } catch {
        problems.push(`${file.name}: upload failed.`);
      }
    }
    if (incoming.length > room) {
      problems.push(`Only the first ${room} file(s) were added.`);
    }
    setBusy(false);
    setMessages(problems);
    if (accepted.length) onChange([...attachments, ...accepted]);
  };

  const remove = async (attachment: SongRequestAttachment) => {
    await attachmentService.remove(attachment);
    onChange(attachments.filter((item) => item.id !== attachment.id));
  };

  return (
    <div className="flex flex-col gap-5">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-12 text-center transition-colors",
          dragging ? "border-gold bg-gold/[0.06]" : "border-border bg-surface/60",
        )}
      >
        {busy ? (
          <Loader2 className="size-6 animate-spin text-gold" />
        ) : (
          <UploadCloud className="size-6 text-gold" />
        )}
        <p className="text-sm text-foreground">Drop files here</p>
        <p className="max-w-md text-xs text-muted-foreground">
          Photos, PDFs and voice notes — up to {uploadConfig.maxFiles} files,{" "}
          {formatBytes(uploadConfig.maxFileBytes)} each.
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-1 rounded-full border border-gold/50 px-6 py-2.5 text-[0.65rem] uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold/10"
        >
          Browse files
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={uploadConfig.accept}
          className="hidden"
          onChange={(event) => {
            void handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {messages.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {messages.map((message) => (
            <li key={message} role="alert" className="text-xs text-destructive">
              {message}
            </li>
          ))}
        </ul>
      ) : null}

      {attachments.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {attachments.map((attachment) => {
            const Icon = iconByKind[attachment.kind];
            return (
              <li
                key={attachment.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
              >
                {attachment.kind === "image" && attachment.dataUrl ? (
                  <img
                    src={attachment.dataUrl}
                    alt=""
                    className="size-10 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
                    <Icon className="size-4" />
                  </span>
                )}
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-xs text-foreground">{attachment.name}</span>
                  <span className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                    {attachment.kind} · {formatBytes(attachment.sizeBytes)}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => void remove(attachment)}
                  aria-label={`Remove ${attachment.name}`}
                  className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-gold"
                >
                  <X className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
