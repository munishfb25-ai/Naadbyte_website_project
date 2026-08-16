import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronDown, Play, Compass, Sparkles } from "lucide-react";
import { brandAssets } from "@/data/assets";
import { heroContent } from "@/content/sections";
import { routes } from "@/data/routes";
import { ActionLink } from "@/components/common/ActionLink";
import { RouteLink } from "@/components/common/RouteLink";
import { Particles } from "@/components/common/Particles";

export function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 22 });
  const bgX = useTransform(springX, [-1, 1], [22, -22]);
  const bgY = useTransform(springY, [-1, 1], [14, -14]);
  const contentX = useTransform(springX, [-1, 1], [-10, 10]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);

    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      mq.removeEventListener("change", onChange);
    };
  }, [mouseX, mouseY]);

  return (
    <section
      id="home"
      className="relative flex min-h-[92vh] w-full items-center justify-center overflow-hidden bg-background text-center"
    >
      {/* Background Hero Artwork with Parallax & Precision Crop */}
      <motion.div
        className="absolute inset-[-5%]"
        style={{ x: reduced ? 0 : bgX, y: reduced ? 0 : bgY }}
      >
        <img
          src={brandAssets.heroBackground}
          alt={brandAssets.heroBackgroundAlt}
          fetchPriority="high"
          decoding="async"
          className="size-full object-cover object-center brightness-110 contrast-105 transition-opacity duration-1000"
        />
      </motion.div>

      {/* Atmospheric Overlays for Readability & Cinematic Depth */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(13,12,11,0.35)_0%,rgba(13,12,11,0.75)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"
      />

      {/* Floating Gold Particles */}
      <Particles count={40} />

      {/* Main Hero Content - Centered */}
      <motion.div
        style={{ x: reduced ? 0 : contentX }}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-32 pb-24 lg:px-12"
      >
        <div className="flex flex-col items-center text-center max-w-3xl">
          {/* Large Logo Header without background - Centered */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center gap-5 mb-6"
          >
            <div className="relative">
              <img
                src={brandAssets.logoFull}
                alt={brandAssets.logoAlt}
                width={340}
                height={130}
                className="relative w-[280px] sm:w-[320px] md:w-[380px] h-auto object-contain"
              />
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-gold backdrop-blur-md shadow-[0_0_20px_rgba(225,157,59,0.2)]">
              <Sparkles className="size-3.5 text-gold animate-pulse" aria-hidden />
              {heroContent.eyebrow}
            </span>
          </motion.div>

          {/* Main Title / Brand Display - Centered */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-2"
          >
            <h1 className="text-balance font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-foreground">
              {heroContent.headline[0]}{" "}
              <span className="italic block sm:inline text-gold-gradient filter drop-shadow-[0_2px_12px_rgba(225,157,59,0.25)]">
                {heroContent.headline[1]}
              </span>
            </h1>
          </motion.div>

          {/* Subtitle Copy - Centered */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 max-w-2xl text-balance text-base sm:text-lg text-muted-foreground leading-relaxed font-normal"
          >
            {heroContent.subtitle}
          </motion.p>

          {/* Action CTAs - Centered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.42 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
            <ActionLink
              href={heroContent.primaryCta.href}
              size="lg"
              className="group shadow-[0_0_30px_rgba(225,157,59,0.4)] hover:shadow-[0_0_45px_rgba(225,157,59,0.6)] transition-all duration-300"
            >
              <Play
                className="size-4 fill-primary-foreground transition-transform duration-300 group-hover:scale-110"
                aria-hidden
              />
              {heroContent.primaryCta.label}
            </ActionLink>

            <RouteLink
              to={routes.createYourSong}
              variant="outline"
              size="lg"
              className="border-gold/40 bg-background/40 backdrop-blur-md hover:bg-gold/15 hover:border-gold shadow-[0_0_20px_rgba(225,157,59,0.15)] transition-all duration-300"
            >
              <Sparkles className="size-4 text-gold" aria-hidden />
              Create Your Song
            </RouteLink>

            <ActionLink
              href={heroContent.secondaryCta.href}
              variant="ghost"
              size="lg"
              className="hover:bg-gold/10 hover:text-gold transition-colors duration-300"
            >
              <Compass className="size-4" aria-hidden />
              {heroContent.secondaryCta.label}
            </ActionLink>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.a
        href="#latest-release"
        aria-label="Scroll to latest release"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute inset-x-0 bottom-6 z-10 mx-auto flex w-fit flex-col items-center gap-1.5 text-muted-foreground transition-colors hover:text-gold group"
      >
        <span className="text-[0.625rem] font-semibold uppercase tracking-[0.35em] text-muted-foreground/80 group-hover:text-gold transition-colors">
          {heroContent.scrollHint}
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-full border border-gold/20 bg-background/30 p-1.5 backdrop-blur-sm group-hover:border-gold/50 transition-colors"
        >
          <ChevronDown className="size-3.5 text-gold" aria-hidden />
        </motion.span>
      </motion.a>
    </section>
  );
}
