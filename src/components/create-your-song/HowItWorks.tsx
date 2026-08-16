import { motion } from "framer-motion";
import { PenLine, Feather, Headphones, Music4 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: PenLine,
      title: "Share Your Story",
      body: "Describe your memories, emotions, and milestone details in a simple guided questionnaire.",
    },
    {
      num: "02",
      icon: Feather,
      title: "We Compose & Record",
      body: "Our writers and live vocalists shape original melody and lyrics around your emotion.",
    },
    {
      num: "03",
      icon: Headphones,
      title: "You Review & Refine",
      body: "Listen to the private first cut and refine words or tempo until it feels perfect.",
    },
    {
      num: "04",
      icon: Music4,
      title: "Delivered in Studio Quality",
      body: "Receive your label-mastered track, ready to play at your event, gift, or stream.",
    },
  ];

  return (
    <section id="how-it-works" className="relative w-full py-20 md:py-28 border-t border-border/40">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center gap-3 mb-16">
          <span className="eyebrow">The Process</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-balance">
            How It Works
          </h2>
          <p className="max-w-xl text-sm md:text-base text-muted-foreground text-pretty">
            From your memory to a finished studio master in four simple steps.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Subtle gold connector line on desktop */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-12 top-[3.2rem] hidden h-px bg-gold-gradient opacity-20 lg:block"
          />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                className="glass-panel group relative flex flex-col gap-5 rounded-2xl p-7 border border-border/60 transition-all duration-300 hover:border-gold/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-xl border border-gold/40 bg-background text-gold transition-all group-hover:bg-gold/10">
                    <Icon className="size-5" />
                  </div>
                  <span className="font-display text-2xl font-light text-gold/60">{step.num}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-xl leading-tight font-medium text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
