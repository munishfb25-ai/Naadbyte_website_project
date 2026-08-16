import { motion } from "framer-motion";
import {
  ArrowRight,
  Feather,
  Gem,
  Headphones,
  Mic2,
  Music4,
  PenLine,
  Quote,
  Sparkles,
  Waves,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { RouteLink } from "@/components/common/RouteLink";
import { createYourSongSection } from "@/content/sections";
import { routes } from "@/data/routes";

/** Icons are presentation-only, mapped by stable content id (CMS-safe). */
const stepIcons: Record<string, LucideIcon> = {
  story: PenLine,
  compose: Feather,
  review: Headphones,
  alive: Music4,
};

const benefitIcons: Record<string, LucideIcon> = {
  original: Sparkles,
  voices: Mic2,
  studio: Waves,
  yours: Gem,
};

/**
 * Flagship homepage section — positions bespoke commissions as the core
 * product of the label. Copy lives in `@/content/sections`; this file is
 * layout and motion only, and the CTA reuses the existing wizard route.
 */
export function CreateYourSong() {
  const { eyebrow, title, subtitle, intro, occasions, steps, benefits, experience, cta, note } =
    createYourSongSection;

  return (
    <section
      id="create-your-song"
      aria-labelledby="create-your-song-heading"
      className="relative w-full overflow-hidden py-28 md:py-40"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 size-[46rem] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-20 blur-3xl bg-[radial-gradient(circle,oklch(0.82_0.135_82/0.5),transparent_65%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold-gradient opacity-30"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-16 px-5 lg:px-8">
        <div id="create-your-song-heading">
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="-mt-8 max-w-3xl text-pretty text-center text-sm leading-relaxed text-muted-foreground md:text-base"
        >
          {intro}
        </motion.p>

        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="-mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          {occasions.map((occasion) => (
            <li
              key={occasion}
              className="rounded-full border border-border px-4 py-2 text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold"
            >
              {occasion}
            </li>
          ))}
        </motion.ul>

        {/* How it works */}
        <div className="flex w-full flex-col gap-8">
          <h3 className="text-center text-[0.65rem] uppercase tracking-[0.28em] text-gold">
            How It Works
          </h3>
          <ol className="relative grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-8 top-[3.4rem] hidden h-px bg-gold-gradient opacity-25 lg:block"
            />
            {steps.map((step, i) => {
              const Icon = stepIcons[step.id] ?? Music4;
              return (
                <motion.li
                  key={step.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
                  className="glass-panel group relative flex flex-col gap-4 rounded-2xl p-7 transition-colors hover:border-gold/40"
                >
                  <span className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-full border border-gold/40 bg-background text-gold transition-all group-hover:bg-gold/10">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="font-display text-3xl text-gold-gradient opacity-60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <h4 className="font-display text-2xl leading-tight">{step.title}</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </motion.li>
              );
            })}
          </ol>
        </div>

        {/* Benefits + experience */}
        <div className="grid w-full gap-6 lg:grid-cols-3">
          <ul className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
            {benefits.map((benefit, i) => {
              const Icon = benefitIcons[benefit.id] ?? Heart;
              return (
                <motion.li
                  key={benefit.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: "easeOut" }}
                  className="flex gap-4 rounded-2xl border border-border/70 p-6 transition-colors hover:border-gold/40"
                >
                  <Icon className="mt-1 size-5 shrink-0 text-gold" aria-hidden />
                  <div className="flex flex-col gap-2">
                    <h4 className="font-display text-xl leading-tight">{benefit.title}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{benefit.body}</p>
                  </div>
                </motion.li>
              );
            })}
          </ul>

          <motion.figure
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="glass-panel flex flex-col justify-center gap-5 rounded-2xl p-8"
          >
            <Quote className="size-6 text-gold" aria-hidden />
            <blockquote className="text-pretty text-base leading-relaxed text-foreground/90 md:text-lg">
              {experience.quote}
            </blockquote>
            <figcaption className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
              {experience.attribution}
            </figcaption>
          </motion.figure>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <RouteLink to={routes.createYourSong} size="lg">
            {cta.label}
            <ArrowRight className="size-4" aria-hidden />
          </RouteLink>
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground/70">
            {note}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
