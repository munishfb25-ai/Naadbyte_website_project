import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { songRequestSteps, type SongRequestStepId } from "@/data/song-request-options";
import {
  isStepComplete,
  validateAll,
  validateStep,
  type FieldErrors,
} from "@/lib/song-request-schema";
import { songRequestService } from "@/services/song-request-service";
import {
  createDraft,
  localDraftStore,
  stripHeavyPayloads,
  type SongRequestDraftStore,
} from "@/services/song-request-draft-store";
import type { SongRequest, SongRequestInput } from "@/types";

export type WizardStatus = "idle" | "submitting" | "success" | "error";

const AUTOSAVE_DELAY_MS = 600;

const initialValues: Partial<SongRequestInput> = {
  emotions: [],
  referenceSongs: [],
  attachments: [],
  source: "web-wizard",
};

/**
 * State machine behind the "Create Your Song" journey.
 *
 * Pure state + ports: validation comes from the zod schemas, persistence from
 * a `SongRequestDraftStore`, submission from `songRequestService`. Swapping any
 * of those (CMS, CRM, payment-gated submit) does not touch the UI.
 */
export function useSongRequestWizard(draftStore: SongRequestDraftStore = localDraftStore) {
  const [values, setValues] = useState<Partial<SongRequestInput>>(initialValues);
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<WizardStatus>("idle");
  const [submitted, setSubmitted] = useState<SongRequest | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [restoredDraft, setRestoredDraft] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore after mount only — keeps SSR markup and hydration identical.
  useEffect(() => {
    const draft = draftStore.load();
    if (draft) {
      setValues({ ...initialValues, ...draft.values });
      setStepIndex(Math.min(draft.stepIndex, songRequestSteps.length - 1));
      setSavedAt(draft.updatedAt);
      setRestoredDraft(true);
    }
    setHydrated(true);
  }, [draftStore]);

  // Debounced autosave.
  useEffect(() => {
    if (!hydrated || status === "success") return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const draft = createDraft(stepIndex, stripHeavyPayloads(values));
      draftStore.save(draft);
      setSavedAt(draft.updatedAt);
    }, AUTOSAVE_DELAY_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [values, stepIndex, hydrated, status, draftStore]);

  const step = songRequestSteps[stepIndex]!;
  const totalSteps = songRequestSteps.length;

  const setValue = useCallback(
    <K extends keyof SongRequestInput>(key: K, value: SongRequestInput[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key as string];
        return next;
      });
    },
    [],
  );

  const patch = useCallback((partial: Partial<SongRequestInput>) => {
    setValues((prev) => ({ ...prev, ...partial }));
  }, []);

  const completedSteps = useMemo(
    () => songRequestSteps.map((_, index) => isStepComplete(index, values)),
    [values],
  );

  const canGoNext = completedSteps[stepIndex] ?? false;

  const goTo = useCallback(
    (index: number) => {
      const target = Math.max(0, Math.min(index, totalSteps - 1));
      setErrors({});
      setStepIndex(target);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [totalSteps],
  );

  const next = useCallback(() => {
    const stepErrors = validateStep(step.id as SongRequestStepId, values);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return false;
    }
    goTo(stepIndex + 1);
    return true;
  }, [goTo, step.id, stepIndex, values]);

  const back = useCallback(() => goTo(stepIndex - 1), [goTo, stepIndex]);

  const reset = useCallback(() => {
    draftStore.clear();
    setValues(initialValues);
    setStepIndex(0);
    setErrors({});
    setStatus("idle");
    setSubmitted(null);
    setSubmitError(null);
    setSavedAt(null);
    setRestoredDraft(false);
  }, [draftStore]);

  const submit = useCallback(async () => {
    const allErrors = validateAll(values);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const firstInvalid = songRequestSteps.findIndex((_, index) => !isStepComplete(index, values));
      if (firstInvalid >= 0) goTo(firstInvalid);
      return;
    }
    setStatus("submitting");
    setSubmitError(null);
    try {
      const payload = {
        ...values,
        brief: values.story ?? "",
      } as SongRequestInput;
      const request = await songRequestService.submit(payload);
      setSubmitted(request);
      setStatus("success");
      draftStore.clear();
    } catch (error) {
      setStatus("error");
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
      );
    }
  }, [draftStore, goTo, values]);

  return {
    values,
    setValue,
    patch,
    errors,
    setErrors,
    step,
    stepIndex,
    totalSteps,
    completedSteps,
    canGoNext,
    goTo,
    next,
    back,
    reset,
    submit,
    status,
    submitted,
    submitError,
    hydrated,
    restoredDraft,
    savedAt,
  };
}

export type SongRequestWizard = ReturnType<typeof useSongRequestWizard>;
