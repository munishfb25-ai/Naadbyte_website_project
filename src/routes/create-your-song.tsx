import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/layout/PageLayout";
import { CreateYourSongWizard } from "@/components/create-your-song/CreateYourSongWizard";
import { FeaturedSamples } from "@/components/create-your-song/FeaturedSamples";
import { WhyNaadByte } from "@/components/create-your-song/WhyNaadByte";
import { HowItWorks } from "@/components/create-your-song/HowItWorks";
import { TestimonialSection } from "@/components/create-your-song/TestimonialSection";
import { createYourSongPage } from "@/content/pages";
import { pageMeta, withBrand } from "@/lib/seo";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { brandAssets } from "@/data/assets";

export const Route = createFileRoute("/create-your-song")({
  head: () => ({
    meta: pageMeta({
      title: withBrand("Bespoke Custom Music — Create Your Song"),
      description:
        "Commission an original, studio-grade custom song written around your story, memory, or milestone.",
    }),
  }),
  component: CreateYourSongPage,
});

const OCCASIONS = [
  "Weddings",
  "Birthdays",
  "Anniversaries",
  "Memorials & Tributes",
  "Spiritual Journeys",
  "Romance & Milestones",
  "Films & Brands",
];

function CreateYourSongPage() {
  const scrollToWizard = () => {
    const el = document.getElementById("commission-studio");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <PageLayout>
      {/* =========================================================================
          HERO SECTION — Minimalist, Emotional, High Visual Impact
          ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-28 lg:pb-32">
        {/* Ambient golden glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 size-[50rem] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-20 blur-3xl bg-[radial-gradient(circle,oklch(0.82_0.135_82/0.6),transparent_65%)]"
        />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-5 lg:px-8">
          {/* Main Hero Copy Box */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center text-center max-w-4xl gap-6"
          >
            {/* Eyebrow badge */}
            <span className="eyebrow flex items-center gap-2">
              <Sparkles className="size-3.5 text-gold" />
              {createYourSongPage.eyebrow}
            </span>

            {/* Single Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-tight text-balance">
              Turn Your Story Into an{" "}
              <span className="text-gold-gradient font-light">Original Song</span>
            </h1>

            {/* One Short Supporting Sentence (Max 20 words: 19 words) */}
            <p className="max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty font-light">
              Tell us your moment. Our composers write, record, and master an original studio track
              made only for you.
            </p>

            {/* Single Primary CTA */}
            <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={scrollToWizard}
                className="group inline-flex items-center gap-3 rounded-full bg-gold-gradient px-8 py-4 text-xs uppercase tracking-[0.22em] font-semibold text-primary-foreground transition-all duration-300 shadow-xl hover:scale-105 glow-gold cursor-pointer"
              >
                <span>Begin Your Song</span>
                <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-1" />
              </button>
            </div>

            {/* Category Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 max-w-3xl">
              {OCCASIONS.map((occasion) => (
                <button
                  key={occasion}
                  type="button"
                  onClick={scrollToWizard}
                  className="rounded-full border border-border/70 bg-secondary/30 backdrop-blur-md px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground transition-all duration-200 hover:border-gold/50 hover:text-gold hover:bg-gold/5 cursor-pointer"
                >
                  {occasion}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Hero Visual — Luxury Framed Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl md:rounded-3xl border border-gold/30 bg-card/60 shadow-2xl backdrop-blur-sm p-2 md:p-3"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl md:rounded-2xl">
              <img
                src={brandAssets.flagshipStudioBackground}
                alt="NaadByte flagship bespoke studio recording environment"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/30" />

              {/* Minimal floating badge */}
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 flex items-center gap-3 rounded-full bg-background/80 px-4 py-2 backdrop-blur-md border border-white/10">
                <span className="size-2 rounded-full bg-gold animate-pulse" />
                <span className="text-[0.65rem] md:text-xs uppercase tracking-[0.2em] font-medium text-foreground/90">
                  NaadByte Bespoke Studio
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED SONGS SECTION — Sample compositions with audio player
          ========================================================================= */}
      <FeaturedSamples />

      {/* =========================================================================
          WHY NAADBYTE — 4 Premium Feature Cards
          ========================================================================= */}
      <WhyNaadByte />

      {/* =========================================================================
          HOW IT WORKS — 4 Simple One-Sentence Steps
          ========================================================================= */}
      <HowItWorks />

      {/* =========================================================================
          ONE POWERFUL TESTIMONIAL — Emotion First
          ========================================================================= */}
      <TestimonialSection />

      {/* =========================================================================
          INTERACTIVE COMMISSION WIZARD
          ========================================================================= */}
      <section
        id="commission-studio"
        className="relative w-full py-20 md:py-32 border-t border-border/40"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/4 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-3xl bg-[radial-gradient(circle,oklch(0.82_0.135_82/0.5),transparent_65%)]"
        />

        <div className="relative mx-auto w-full max-w-5xl px-5 lg:px-8">
          <div className="flex flex-col items-center text-center gap-3 mb-12">
            <span className="eyebrow">Commission Studio</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-balance">
              Begin Your Song
            </h2>
            <p className="max-w-xl text-sm md:text-base text-muted-foreground text-pretty">
              Take three minutes to share the memory, the language, and the feeling you want to
              preserve.
            </p>
          </div>

          {/* Wizard Card Container */}
          <CreateYourSongWizard />
        </div>
      </section>
    </PageLayout>
  );
}
