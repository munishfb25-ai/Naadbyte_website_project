import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export function TestimonialSection() {
  return (
    <section className="relative w-full py-16 md:py-24">
      <div className="relative mx-auto w-full max-w-5xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass-panel relative overflow-hidden rounded-3xl p-8 md:p-14 border border-gold/30 text-center flex flex-col items-center gap-8 shadow-2xl"
        >
          {/* Subtle radial gold glow behind quote */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl bg-[radial-gradient(circle,oklch(0.82_0.135_82/0.6),transparent_65%)]"
          />

          <div className="flex size-14 items-center justify-center rounded-full border border-gold/50 bg-gold/10 text-gold glow-gold">
            <Quote className="size-6 text-gold" />
          </div>

          <blockquote className="relative z-10 max-w-3xl font-display text-xl md:text-2xl lg:text-3xl leading-relaxed text-foreground/95 text-balance">
            “They didn't just give us a song. They captured the morning we got married—the light,
            the nervousness, the sacred tears. Everyone cried before the first chorus.”
          </blockquote>

          <div className="flex flex-col items-center gap-1">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold">
              A Bespoke Wedding Commission
            </span>
            <span className="text-xs text-muted-foreground">Amritsar</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
