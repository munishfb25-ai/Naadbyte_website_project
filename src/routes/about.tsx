import { useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { PageLayout, PageSection } from "@/components/layout/PageLayout";
import { RouteLink } from "@/components/common/RouteLink";
import { brandAssets, albumArt, genreArt } from "@/data/assets";
import { pageMeta, withBrand } from "@/lib/seo";
import { routes } from "@/data/routes";
import {
  Heart,
  Compass,
  Flame,
  Sparkles,
  ShieldCheck,
  PenTool,
  Lightbulb,
  Users,
  ArrowRight,
  Star,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: pageMeta({
      title: withBrand("About"),
      description: "Every Meaningful Moment Deserves a Soundtrack.",
    }),
  }),
  component: AboutPage,
});

function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <PageLayout>
      <div ref={containerRef} className="relative w-full bg-background overflow-hidden">
        {/* SECTION 1: HERO */}
        <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-5 pt-24 lg:px-8">
          <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0">
            <img
              src={brandAssets.heroBackground}
              alt="Cinematic Background"
              className="h-full w-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>

          <div className="relative z-10 w-full max-w-4xl text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="inline-flex items-center rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 backdrop-blur-md mb-8"
            >
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
                About NaadByte
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="font-display text-4xl leading-tight text-white md:text-6xl lg:text-7xl drop-shadow-2xl mb-8"
            >
              Every Meaningful Moment Deserves a Soundtrack.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col gap-6 text-base md:text-xl text-muted-foreground font-light max-w-2xl leading-relaxed mb-12"
            >
              <p>
                NaadByte creates original music inspired by real life, meaningful relationships,
                personal growth, spirituality, hope and the emotions that shape who we become.
              </p>
              <p className="text-white/90 font-medium">
                Every song begins with a story worth telling.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center gap-5"
            >
              <RouteLink
                to={routes.music}
                className="h-14 px-10 rounded-full bg-gold text-black font-semibold tracking-wide hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center w-full sm:w-auto"
              >
                Listen Now
              </RouteLink>
              <RouteLink
                to={routes.createYourSong}
                variant="outline"
                className="h-14 px-10 rounded-full border border-white/20 bg-white/5 text-white font-semibold tracking-wide hover:border-gold/50 hover:text-gold transition-colors flex items-center justify-center backdrop-blur-md w-full sm:w-auto"
              >
                Create Your Song
              </RouteLink>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: OUR STORY */}
        <PageSection className="py-24 md:py-32 relative border-t border-white/5">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUp}
                className="relative rounded-2xl overflow-hidden aspect-[4/5] lg:aspect-square border border-white/10"
              >
                <img
                  src={genreArt.cinematic}
                  alt="Artistic expression"
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="flex flex-col gap-6"
              >
                <motion.h2
                  variants={fadeUp}
                  className="font-display text-4xl md:text-5xl text-white mb-4"
                >
                  Music That Means Something.
                </motion.h2>

                <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
                  <motion.p variants={fadeUp}>NaadByte was born from a simple belief:</motion.p>

                  <motion.div
                    variants={fadeUp}
                    className="pl-4 border-l border-gold/30 space-y-3 py-2 text-white/90"
                  >
                    <p>Music should do more than entertain.</p>
                    <p>It should connect.</p>
                    <p>It should inspire.</p>
                    <p>It should comfort.</p>
                    <p>It should make people think.</p>
                  </motion.div>

                  <motion.p variants={fadeUp}>
                    Every song begins with a real experience, a lesson, a conversation, a memory or
                    an emotion.
                  </motion.p>

                  <motion.div variants={fadeUp} className="space-y-2">
                    <p>Some songs celebrate success.</p>
                    <p>Some explore relationships.</p>
                    <p>Some encourage courage during difficult times.</p>
                    <p>Some invite reflection and inner peace.</p>
                  </motion.div>

                  <motion.p variants={fadeUp} className="text-white font-medium mt-4">
                    Rather than following trends, NaadByte creates music with purpose—songs that
                    people can return to because they continue to hold meaning.
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </div>
        </PageSection>

        {/* SECTION 3: WHAT INSPIRES OUR MUSIC */}
        <PageSection className="py-24 md:py-32 bg-black/50 relative border-y border-white/5">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="font-display text-4xl md:text-5xl text-white">
                What Inspires Our Music
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {[
                {
                  icon: <Compass className="size-8 text-gold" strokeWidth={1.5} />,
                  title: "Life",
                  desc: "Stories inspired by everyday experiences, personal growth, challenges and the lessons life teaches us.",
                },
                {
                  icon: <Heart className="size-8 text-gold" strokeWidth={1.5} />,
                  title: "Relationships",
                  desc: "Music about love, family, friendship, trust, gratitude, loss, forgiveness and the people who shape our lives.",
                },
                {
                  icon: <Flame className="size-8 text-gold" strokeWidth={1.5} />,
                  title: "Purpose",
                  desc: "Songs that encourage resilience, confidence, hope, courage and becoming the best version of ourselves.",
                },
                {
                  icon: <Sparkles className="size-8 text-gold" strokeWidth={1.5} />,
                  title: "Spirit",
                  desc: "Music inspired by reflection, faith, peace, mindfulness and finding meaning beyond everyday life.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="flex flex-col gap-6 items-start"
                >
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-white mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed font-light">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </PageSection>

        {/* SECTION 4: HOW EVERY SONG IS CREATED */}
        <PageSection className="py-24 md:py-32 relative">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-24"
            >
              <h2 className="font-display text-4xl md:text-5xl text-white">
                How Every Song Is Created
              </h2>
            </motion.div>

            {/* Timeline */}
            <div className="relative mb-24">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2" />

              <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 relative z-10">
                {[
                  "Real Experience",
                  "Idea",
                  "Lyrics",
                  "Melody",
                  "Creative Production",
                  "Release",
                ].map((step, i, arr) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex flex-col items-center gap-4 group"
                  >
                    <div className="w-4 h-4 rounded-full bg-gold/20 border-2 border-gold shadow-[0_0_10px_rgba(212,175,55,0.5)] group-hover:bg-gold transition-colors" />
                    <span className="text-sm uppercase tracking-widest text-white/80 whitespace-nowrap group-hover:text-gold transition-colors">
                      {step}
                    </span>
                    {i < arr.length - 1 && (
                      <ArrowRight className="md:hidden text-white/20 mt-4 size-5" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center space-y-6 text-lg text-muted-foreground font-light leading-relaxed"
            >
              <p>Every NaadByte song starts with an original idea inspired by life.</p>
              <p>The lyrics, storytelling, concepts and melodies are created by NaadByte.</p>
              <p>
                Modern AI-assisted production tools are then used as creative instruments to help
                shape arrangements, sound design and vocal performances.
              </p>
              <p className="text-white font-medium text-xl pt-4">
                Technology supports the creative process, but the emotion, message and artistic
                direction always remain human.
              </p>
            </motion.div>
          </div>
        </PageSection>

        {/* SECTION 5: OUR PHILOSOPHY */}
        <PageSection className="py-32 md:py-48 bg-black relative border-y border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />

          <div className="mx-auto max-w-4xl text-center relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-16"
            >
              Every Story Has A Voice.
              <br />
              <span className="text-gold">Every Moment Has A Melody.</span>
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-8 text-xl md:text-2xl text-muted-foreground font-light tracking-wide"
            >
              <motion.p variants={fadeUp}>Life is filled with unforgettable moments.</motion.p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 text-base uppercase tracking-widest text-white/50 font-medium">
                <motion.span variants={fadeUp}>A first step.</motion.span>
                <motion.span variants={fadeUp}>A goodbye.</motion.span>
                <motion.span variants={fadeUp}>A promise.</motion.span>
                <motion.span variants={fadeUp}>A victory.</motion.span>
                <motion.span variants={fadeUp}>A failure.</motion.span>
                <motion.span variants={fadeUp}>A prayer.</motion.span>
                <motion.span variants={fadeUp}>A dream.</motion.span>
                <motion.span variants={fadeUp}>A lesson.</motion.span>
              </div>

              <motion.p variants={fadeUp}>
                Every meaningful experience leaves something behind.
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="text-white text-2xl md:text-3xl leading-relaxed pt-8 font-display"
              >
                NaadByte exists to transform those moments into music that people can revisit
                whenever they need inspiration, comfort or connection.
              </motion.p>
            </motion.div>
          </div>
        </PageSection>

        {/* SECTION 6: LOOKING AHEAD */}
        <PageSection className="py-24 md:py-32 relative">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-4xl md:text-5xl text-white mb-10">
                Building More Than Music.
              </h2>

              <div className="space-y-8 text-lg text-muted-foreground font-light leading-relaxed">
                <p>
                  NaadByte is growing into a creative platform where music, storytelling and
                  technology come together.
                </p>
                <p>Today we create original songs and cinematic music experiences.</p>
                <p className="text-white">
                  Tomorrow listeners will also be able to create personalised songs inspired by
                  their own stories, milestones and memories.
                </p>
                <p className="text-white/80 italic">
                  Whether celebrating a birthday, a wedding, a loved one, a business, an achievement
                  or a life lesson—
                </p>
                <p className="text-2xl font-display text-gold pt-4">
                  Every meaningful moment deserves its own soundtrack.
                </p>
              </div>
            </motion.div>
          </div>
        </PageSection>

        {/* SECTION 7: OUR VALUES */}
        <PageSection className="py-24 md:py-32 bg-black/50 border-y border-white/5">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8"
            >
              {[
                {
                  icon: <ShieldCheck className="size-6 text-gold" strokeWidth={1.5} />,
                  title: "Authenticity",
                  desc: "Every song begins with genuine emotion.",
                },
                {
                  icon: <PenTool className="size-6 text-gold" strokeWidth={1.5} />,
                  title: "Creativity",
                  desc: "Original ideas always come before technology.",
                },
                {
                  icon: <Star className="size-6 text-gold" strokeWidth={1.5} />,
                  title: "Purpose",
                  desc: "Music should leave people with something meaningful.",
                },
                {
                  icon: <Zap className="size-6 text-gold" strokeWidth={1.5} />,
                  title: "Innovation",
                  desc: "New technology is embraced without losing human creativity.",
                },
                {
                  icon: <Users className="size-6 text-gold" strokeWidth={1.5} />,
                  title: "Connection",
                  desc: "The greatest songs are the ones people see themselves in.",
                },
              ].map((val, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex flex-col items-center text-center gap-4"
                >
                  <div className="p-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                    {val.icon}
                  </div>
                  <h4 className="text-lg text-white font-medium tracking-wide">{val.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </PageSection>

        {/* SECTION 8: FINAL CALL TO ACTION */}
        <PageSection className="py-24 md:py-32">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative overflow-hidden rounded-[2rem] border border-white/10 p-12 md:p-24 text-center bg-black"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src={albumArt.echoes}
                  alt="Cinematic finish"
                  className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
              </div>

              <div className="relative z-10 flex flex-col items-center gap-8">
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-xl">
                  What Story Will Your Next Song Tell?
                </h2>
                <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl">
                  Explore original music inspired by real experiences, or let us help turn your own
                  story into something unforgettable.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-5 mt-4 w-full sm:w-auto">
                  <RouteLink
                    to={routes.music}
                    className="h-14 px-10 rounded-full bg-gold text-black font-semibold tracking-wide hover:scale-105 transition-transform shadow-lg flex items-center justify-center w-full sm:w-auto"
                  >
                    Explore Music
                  </RouteLink>
                  <RouteLink
                    to={routes.createYourSong}
                    variant="outline"
                    className="h-14 px-10 rounded-full border border-white/20 bg-black/40 text-white font-semibold tracking-wide hover:border-gold/50 hover:text-gold transition-colors flex items-center justify-center backdrop-blur-md w-full sm:w-auto"
                  >
                    Create Your Song
                  </RouteLink>
                </div>
              </div>
            </motion.div>
          </div>
        </PageSection>
      </div>
    </PageLayout>
  );
}
