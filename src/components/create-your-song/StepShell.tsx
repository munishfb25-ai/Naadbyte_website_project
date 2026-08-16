import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Consistent frame for every step: eyebrow, title, subtitle, body. */
export function StepShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-8"
    >
      <header className="flex flex-col gap-3">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="text-2xl leading-tight md:text-4xl">{title}</h2>
        {subtitle ? <p className="max-w-2xl text-sm text-muted-foreground">{subtitle}</p> : null}
      </header>
      {children}
    </motion.div>
  );
}

/** Inline validation message. */
export function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-xs text-destructive">
      {message}
    </p>
  );
}

/** Selectable card used for occasion / emotion / language / genre choices. */
export function ChoiceCard({
  label,
  description,
  selected,
  onSelect,
  imageSrc,
}: {
  label: string;
  description?: string | undefined;
  selected: boolean;
  onSelect: () => void;
  imageSrc?: string | undefined;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "group relative flex h-full flex-col items-start gap-2 overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300",
        selected
          ? "border-gold/70 bg-gold/[0.07] glow-gold"
          : "border-border bg-surface hover:border-gold/40 hover:bg-surface/80",
      )}
    >
      {imageSrc ? (
        <span
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-20 transition-opacity duration-500 group-hover:opacity-30"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
      ) : null}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,oklch(0.14_0.012_60/0.92))]"
      />
      <span className="relative text-sm tracking-wide text-foreground">{label}</span>
      {description ? (
        <span className="relative text-xs leading-relaxed text-muted-foreground">
          {description}
        </span>
      ) : null}
    </button>
  );
}
