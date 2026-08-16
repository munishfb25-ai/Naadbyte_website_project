import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { useSongRequestWizard } from "@/hooks/useSongRequestWizard";
import { WizardProgress } from "./WizardProgress";
import {
  ContactStep,
  EmotionStep,
  GenreStep,
  LanguageStep,
  OccasionStep,
  ReferencesStep,
  ReviewStep,
  StoryStep,
  UploadsStep,
} from "./Steps";
import { RouteLink } from "@/components/common/RouteLink";
import { routes } from "@/data/routes";

/**
 * The "Create Your Song" journey — orchestration only.
 * State lives in `useSongRequestWizard`, validation in the zod schemas,
 * persistence and submission behind service ports.
 */
export function CreateYourSongWizard() {
  const wizard = useSongRequestWizard();
  const {
    step,
    stepIndex,
    totalSteps,
    completedSteps,
    goTo,
    next,
    back,
    submit,
    reset,
    status,
    submitted,
    submitError,
    savedAt,
    restoredDraft,
  } = wizard;

  if (status === "success" && submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-panel relative overflow-hidden rounded-3xl px-6 py-16 text-center md:px-16 md:py-24"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl bg-[radial-gradient(circle,oklch(0.82_0.135_82/0.6),transparent_65%)]"
        />
        <div className="relative flex flex-col items-center gap-6">
          <span className="flex size-14 items-center justify-center rounded-full bg-gold-gradient text-primary-foreground glow-gold">
            <Check className="size-6" strokeWidth={2.5} />
          </span>
          <span className="eyebrow">Commission received</span>
          <h2 className="max-w-2xl text-balance text-3xl leading-tight md:text-5xl">
            Your song has begun.
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Reference <span className="text-gold">{submitted.id}</span> — our composers are reading
            your story now. You'll hear from us at{" "}
            <span className="text-foreground">{submitted.email}</span> within two working days with
            a creative direction and quote.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <RouteLink to={routes.music}>Explore the catalogue</RouteLink>
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-gold/50 px-8 py-3 text-[0.65rem] uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold/10"
            >
              Commission another
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const isReview = step.id === "review";

  return (
    <div className="flex flex-col gap-10">
      <WizardProgress stepIndex={stepIndex} completedSteps={completedSteps} onSelect={goTo} />

      <div className="glass-panel rounded-3xl p-6 md:p-10">
        <AnimatePresence mode="wait">
          <div key={step.id}>
            {step.id === "occasion" && <OccasionStep wizard={wizard} />}
            {step.id === "story" && <StoryStep wizard={wizard} />}
            {step.id === "emotion" && <EmotionStep wizard={wizard} />}
            {step.id === "language" && <LanguageStep wizard={wizard} />}
            {step.id === "genre" && <GenreStep wizard={wizard} />}
            {step.id === "references" && <ReferencesStep wizard={wizard} />}
            {step.id === "uploads" && <UploadsStep wizard={wizard} />}
            {step.id === "contact" && <ContactStep wizard={wizard} />}
            {step.id === "review" && <ReviewStep wizard={wizard} />}
          </div>
        </AnimatePresence>

        {submitError ? (
          <p role="alert" className="mt-6 text-xs text-destructive">
            {submitError}
          </p>
        ) : null}

        <div className="mt-10 flex flex-col gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={back}
            disabled={stepIndex === 0}
            className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-gold disabled:opacity-40"
          >
            <ArrowLeft className="size-3.5" /> Back
          </button>

          <span className="text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground/70">
            {savedAt
              ? `${restoredDraft ? "Draft restored · " : ""}Progress saved`
              : "Autosaving as you write"}
          </span>

          {isReview ? (
            <button
              type="button"
              onClick={() => void submit()}
              disabled={status === "submitting"}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-gradient px-8 py-3.5 text-[0.65rem] uppercase tracking-[0.22em] text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60"
            >
              {status === "submitting" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Sparkles className="size-3.5" />
              )}
              Begin my song
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-gradient px-8 py-3.5 text-[0.65rem] uppercase tracking-[0.22em] text-primary-foreground transition-all hover:brightness-110"
            >
              Continue <ArrowRight className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <p className="text-center text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground/60">
        Step {stepIndex + 1} of {totalSteps} · Every detail shapes the score
      </p>
    </div>
  );
}
