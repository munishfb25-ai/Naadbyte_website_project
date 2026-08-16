import { budgetOptions, emotionOptions, occasionOptions } from "@/data/song-request-options";
import { select } from "@/services";
import { Field, TextArea, TextInput, SelectInput } from "@/components/common/FormField";
import { ChoiceCard, FieldError, StepShell } from "./StepShell";
import { FileDropzone } from "./FileDropzone";
import type { SongRequestWizard } from "@/hooks/useSongRequestWizard";
import type { Language, ReferenceSong, SongEmotion } from "@/types";
import { Plus, X } from "lucide-react";

type StepProps = { wizard: SongRequestWizard };

const languageOptions: { value: Language; label: string; description: string }[] = [
  { value: "hindi", label: "Hindi", description: "Poetic, melodic, deeply Indian." },
  { value: "english", label: "English", description: "Global, contemporary, direct." },
  { value: "punjabi", label: "Punjabi", description: "Rooted, rhythmic, full of life." },
  {
    value: "instrumental",
    label: "Instrumental",
    description: "No words — only feeling.",
  },
];

export function OccasionStep({ wizard }: StepProps) {
  const { values, setValue, errors, step } = wizard;
  return (
    <StepShell eyebrow={step.eyebrow} title={step.title} subtitle={step.subtitle}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {occasionOptions.map((option) => (
          <ChoiceCard
            key={option.value}
            label={option.label}
            description={option.description}
            selected={values.occasion === option.value}
            onSelect={() => setValue("occasion", option.value)}
          />
        ))}
      </div>
      <FieldError message={errors["occasion"]} />
      {values.occasion === "other" ? (
        <Field label="Tell us the occasion" htmlFor="occasionDetail">
          <TextInput
            id="occasionDetail"
            maxLength={200}
            value={values.occasionDetail ?? ""}
            onChange={(event) => setValue("occasionDetail", event.target.value)}
            placeholder="A farewell for my father's retirement…"
          />
          <FieldError message={errors["occasionDetail"]} />
        </Field>
      ) : null}
    </StepShell>
  );
}

export function StoryStep({ wizard }: StepProps) {
  const { values, setValue, errors, step } = wizard;
  return (
    <StepShell eyebrow={step.eyebrow} title={step.title} subtitle={step.subtitle}>
      <div className="grid gap-6">
        <Field label="The story" htmlFor="story">
          <TextArea
            id="story"
            maxLength={4000}
            className="min-h-48"
            value={values.story ?? ""}
            onChange={(event) => setValue("story", event.target.value)}
            placeholder="Where it began, what changed, why this song has to exist…"
          />
          <div className="flex items-center justify-between">
            <FieldError message={errors["story"]} />
            <span className="text-[0.65rem] text-muted-foreground">
              {(values.story ?? "").length} / 4000
            </span>
          </div>
        </Field>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Dedicated to" htmlFor="dedicatedTo">
            <TextInput
              id="dedicatedTo"
              maxLength={120}
              value={values.dedicatedTo ?? ""}
              onChange={(event) => setValue("dedicatedTo", event.target.value)}
              placeholder="Aarav & Meera"
            />
          </Field>
          <Field label="Names, places or lines to include" htmlFor="keyMoments">
            <TextInput
              id="keyMoments"
              maxLength={1000}
              value={values.keyMoments ?? ""}
              onChange={(event) => setValue("keyMoments", event.target.value)}
              placeholder="Rishikesh, 2019 · 'still the same sky'"
            />
          </Field>
        </div>
      </div>
    </StepShell>
  );
}

export function EmotionStep({ wizard }: StepProps) {
  const { values, setValue, errors, step } = wizard;
  const selected = values.emotions ?? [];
  const toggle = (emotion: SongEmotion) => {
    const next = selected.includes(emotion)
      ? selected.filter((item) => item !== emotion)
      : [...selected, emotion].slice(0, 3);
    setValue("emotions", next);
  };
  return (
    <StepShell eyebrow={step.eyebrow} title={step.title} subtitle={step.subtitle}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {emotionOptions.map((option) => (
          <ChoiceCard
            key={option.value}
            label={option.label}
            description={option.description}
            selected={selected.includes(option.value)}
            onSelect={() => toggle(option.value)}
          />
        ))}
      </div>
      <FieldError message={errors["emotions"]} />
    </StepShell>
  );
}

export function LanguageStep({ wizard }: StepProps) {
  const { values, setValue, errors, step } = wizard;
  return (
    <StepShell eyebrow={step.eyebrow} title={step.title} subtitle={step.subtitle}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {languageOptions.map((option) => (
          <ChoiceCard
            key={option.value}
            label={option.label}
            description={option.description}
            selected={values.language === option.value}
            onSelect={() => setValue("language", option.value)}
          />
        ))}
      </div>
      <FieldError message={errors["language"]} />
    </StepShell>
  );
}

export function GenreStep({ wizard }: StepProps) {
  const { values, setValue, errors, step } = wizard;
  const genres = select.genres();
  return (
    <StepShell eyebrow={step.eyebrow} title={step.title} subtitle={step.subtitle}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {genres.map((genre) => (
          <ChoiceCard
            key={genre.id}
            label={genre.name}
            description={genre.description}
            imageSrc={genre.image?.src}
            selected={values.genreId === genre.id}
            onSelect={() => setValue("genreId", genre.id)}
          />
        ))}
      </div>
      <FieldError message={errors["genreId"]} />
    </StepShell>
  );
}

export function ReferencesStep({ wizard }: StepProps) {
  const { values, setValue, errors, step } = wizard;
  const references = values.referenceSongs ?? [];
  const update = (id: string, partial: Partial<ReferenceSong>) =>
    setValue(
      "referenceSongs",
      references.map((item) => (item.id === id ? { ...item, ...partial } : item)),
    );
  const add = () =>
    setValue("referenceSongs", [
      ...references,
      { id: `ref_${Date.now()}`, title: "", artist: "", url: "" },
    ]);
  return (
    <StepShell eyebrow={step.eyebrow} title={step.title} subtitle={step.subtitle}>
      <div className="flex flex-col gap-4">
        {references.map((reference) => (
          <div
            key={reference.id}
            className="grid gap-4 rounded-2xl border border-border bg-surface p-5 md:grid-cols-[1fr_1fr_1.2fr_auto]"
          >
            <TextInput
              aria-label="Track title"
              value={reference.title}
              onChange={(event) => update(reference.id, { title: event.target.value })}
              placeholder="Track title"
            />
            <TextInput
              aria-label="Artist"
              value={reference.artist ?? ""}
              onChange={(event) => update(reference.id, { artist: event.target.value })}
              placeholder="Artist"
            />
            <TextInput
              aria-label="Link"
              value={reference.url ?? ""}
              onChange={(event) => update(reference.id, { url: event.target.value })}
              placeholder="https://open.spotify.com/…"
            />
            <button
              type="button"
              aria-label="Remove reference"
              onClick={() =>
                setValue(
                  "referenceSongs",
                  references.filter((item) => item.id !== reference.id),
                )
              }
              className="self-center rounded-full p-2 text-muted-foreground transition-colors hover:text-gold"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        {references.length < 5 ? (
          <button
            type="button"
            onClick={add}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/50 px-6 py-2.5 text-[0.65rem] uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold/10"
          >
            <Plus className="size-3.5" /> Add reference
          </button>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Optional — but references make the first draft land far closer.
        </p>
        <FieldError message={errors["referenceSongs"]} />
      </div>
    </StepShell>
  );
}

export function UploadsStep({ wizard }: StepProps) {
  const { values, setValue, errors, step } = wizard;
  return (
    <StepShell eyebrow={step.eyebrow} title={step.title} subtitle={step.subtitle}>
      <FileDropzone
        attachments={values.attachments ?? []}
        onChange={(next) => setValue("attachments", next)}
      />
      <FieldError message={errors["attachments"]} />
    </StepShell>
  );
}

export function ContactStep({ wizard }: StepProps) {
  const { values, setValue, errors, step } = wizard;
  return (
    <StepShell eyebrow={step.eyebrow} title={step.title} subtitle={step.subtitle}>
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Your name" htmlFor="name">
          <TextInput
            id="name"
            maxLength={100}
            value={values.name ?? ""}
            onChange={(event) => setValue("name", event.target.value)}
            placeholder="Full name"
          />
          <FieldError message={errors["name"]} />
        </Field>
        <Field label="Email" htmlFor="email">
          <TextInput
            id="email"
            type="email"
            maxLength={255}
            value={values.email ?? ""}
            onChange={(event) => setValue("email", event.target.value)}
            placeholder="you@example.com"
          />
          <FieldError message={errors["email"]} />
        </Field>
        <Field label="Phone (optional)" htmlFor="phone">
          <TextInput
            id="phone"
            maxLength={30}
            value={values.phone ?? ""}
            onChange={(event) => setValue("phone", event.target.value)}
            placeholder="+91 …"
          />
          <FieldError message={errors["phone"]} />
        </Field>
        <Field label="Budget range (optional)" htmlFor="budget">
          <SelectInput
            id="budget"
            value={values.budget ?? ""}
            onChange={(event) => setValue("budget", event.target.value)}
          >
            <option value="">Select a range</option>
            {budgetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Needed by (optional)" htmlFor="deadline">
          <TextInput
            id="deadline"
            type="date"
            value={values.deadline ?? ""}
            onChange={(event) => setValue("deadline", event.target.value)}
          />
        </Field>
      </div>
    </StepShell>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border/60 py-4 md:flex-row md:gap-8">
      <span className="w-48 shrink-0 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <span className="text-sm text-foreground">{value || "—"}</span>
    </div>
  );
}

export function ReviewStep({ wizard }: StepProps) {
  const { values, step, goTo } = wizard;
  const genre = values.genreId ? select.genreById?.(values.genreId) : undefined;
  const occasion = occasionOptions.find((item) => item.value === values.occasion);
  return (
    <StepShell eyebrow={step.eyebrow} title={step.title} subtitle={step.subtitle}>
      <div className="glass-panel rounded-2xl p-6 md:p-8">
        <ReviewRow label="Occasion" value={values.occasionDetail || occasion?.label || ""} />
        <ReviewRow label="Story" value={values.story ?? ""} />
        <ReviewRow label="Dedicated to" value={values.dedicatedTo ?? ""} />
        <ReviewRow
          label="Emotion"
          value={(values.emotions ?? [])
            .map(
              (emotion) => emotionOptions.find((item) => item.value === emotion)?.label ?? emotion,
            )
            .join(" · ")}
        />
        <ReviewRow
          label="Language"
          value={languageOptions.find((item) => item.value === values.language)?.label ?? ""}
        />
        <ReviewRow label="Genre" value={genre?.name ?? values.genreId ?? ""} />
        <ReviewRow
          label="References"
          value={(values.referenceSongs ?? [])
            .map((item) => [item.title, item.artist].filter(Boolean).join(" — "))
            .join(" · ")}
        />
        <ReviewRow
          label="Files"
          value={(values.attachments ?? []).map((item) => item.name).join(" · ")}
        />
        <ReviewRow
          label="Contact"
          value={[values.name, values.email, values.phone].filter(Boolean).join(" · ")}
        />
        <ReviewRow
          label="Budget / timeline"
          value={[values.budget, values.deadline].filter(Boolean).join(" · ")}
        />
        <button
          type="button"
          onClick={() => goTo(0)}
          className="mt-6 text-[0.65rem] uppercase tracking-[0.22em] text-gold transition-opacity hover:opacity-80"
        >
          Edit from the beginning
        </button>
      </div>
    </StepShell>
  );
}
