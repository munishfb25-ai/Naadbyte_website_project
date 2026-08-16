import { motion } from "framer-motion";
import { Sparkles, Mic2, Waves, Gem } from "lucide-react";

export function WhyNaadByte() {
  const features = [
    {
      id: "original",
      icon: Sparkles,
      title: "Original Composition",
      description:
        "Unique melodies and bespoke lyrics crafted specifically for your story, never templated or recycled.",
    },
    {
      id: "musicians",
      icon: Mic2,
      title: "Real Musicians",
      description:
        "Performed by live studio vocalists and instrumentalists in Hindi, English, and Punjabi.",
    },
    {
      id: "production",
      icon: Waves,
      title: "Studio-Grade Production",
      description: "Mixed and mastered to premier label standards in pristine high-fidelity audio.",
    },
    {
      id: "ownership",
      icon: Gem,
      title: "Yours Forever",
      description: "Complete personal ownership to cherish, gift privately, or release worldwide.",
    },
  ];

  return (
    <section className="relative w-full py-20 md:py-28">
      {/* Ambient background accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 top-1/2 size-[32rem] -translate-y-1/2 rounded-full opacity-15 blur-3xl bg-[radial-gradient(circle,oklch(0.82_0.135_82/0.5),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center gap-3 mb-16">
          <span className="eyebrow">The Bespoke Standard</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-balance">
            Why NaadByte
          </h2>
          <p className="max-w-xl text-sm md:text-base text-muted-foreground text-pretty">
            Crafted like fine art — every song is composed from silence around your emotional truth.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                className="glass-panel group relative flex flex-col gap-5 rounded-2xl p-8 border border-border/60 transition-all duration-300 hover:border-gold/50 hover:bg-gold/[0.02]"
              >
                <div className="flex size-12 items-center justify-center rounded-xl border border-gold/40 bg-gold/5 text-gold transition-transform duration-300 group-hover:scale-110 group-hover:bg-gold/10">
                  <Icon className="size-6" strokeWidth={1.75} />
                </div>
                <div className="flex flex-col gap-2.5">
                  <h3 className="font-display text-xl leading-tight font-medium text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
