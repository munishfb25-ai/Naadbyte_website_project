import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { songRequestSteps } from "@/data/song-request-options";
import { cn } from "@/lib/utils";

/**
 * Cinematic progress indicator: a gold filament that fills as the commission
 * takes shape, plus click-to-jump nodes for any step already completed.
 */
export function WizardProgress({
  stepIndex,
  completedSteps,
  onSelect,
}: {
  stepIndex: number;
  completedSteps: boolean[];
  onSelect: (index: number) => void;
}) {
  const total = songRequestSteps.length;
  const progress = (stepIndex / (total - 1)) * 100;
  const current = songRequestSteps[stepIndex]!;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="eyebrow">{current.eyebrow}</span>
          <span className="text-sm text-muted-foreground">{current.title}</span>
        </div>
        <span className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
          {String(stepIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="relative">
        <div className="absolute left-0 right-0 top-[0.6875rem] h-px bg-border" />
        <motion.div
          className="absolute left-0 top-[0.6875rem] h-px bg-gold-gradient"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <ol className="relative flex items-start justify-between">
          {songRequestSteps.map((step, index) => {
            const isDone = completedSteps[index] && index < stepIndex;
            const isCurrent = index === stepIndex;
            const reachable = index <= stepIndex || completedSteps[index - 1] === true;
            return (
              <li key={step.id} className="flex flex-1 flex-col items-center gap-2">
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => reachable && onSelect(index)}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`${step.eyebrow}: ${step.title}`}
                  className={cn(
                    "flex size-[1.375rem] items-center justify-center rounded-full border transition-all",
                    isCurrent
                      ? "border-gold bg-gold-gradient text-primary-foreground glow-gold"
                      : isDone
                        ? "border-gold/60 bg-gold/15 text-gold"
                        : "border-border bg-surface text-muted-foreground",
                    reachable ? "cursor-pointer" : "cursor-not-allowed opacity-60",
                  )}
                >
                  {isDone ? (
                    <Check className="size-3" strokeWidth={3} />
                  ) : (
                    <span className="text-[0.55rem] font-medium">{index + 1}</span>
                  )}
                </button>
                <span
                  className={cn(
                    "hidden text-center text-[0.6rem] uppercase tracking-[0.14em] transition-colors md:block",
                    isCurrent ? "text-gold" : "text-muted-foreground/70",
                  )}
                >
                  {step.title}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
