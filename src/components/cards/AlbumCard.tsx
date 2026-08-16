import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { Album } from "@/types";
import { PlatformIcon } from "@/components/common/PlatformIcon";
import { select } from "@/services";

export function AlbumCard({ release, index = 0 }: { release: Album; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-deep transition-all duration-500 hover:-translate-y-2 hover:border-gold/40"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={release.cover.src}
          alt={release.cover.alt}
          loading="lazy"
          width={768}
          height={768}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.14_0.012_60/0.95),transparent_55%)]"
        />
        <span className="absolute left-4 top-4 rounded-full border border-gold/30 bg-background/60 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-gold backdrop-blur-sm">
          {release.genre}
        </span>
        <span className="absolute bottom-4 right-4 flex size-12 items-center justify-center rounded-full bg-gold-gradient text-primary-foreground opacity-0 transition-all duration-500 group-hover:opacity-100 glow-gold">
          <Play className="size-5" aria-hidden />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-2xl leading-none">{release.title}</h3>
          <span className="text-xs text-muted-foreground">{release.year}</span>
        </div>
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          {release.description}
        </p>
        <div className="flex items-center gap-2 pt-1">
          {release.streamingLinks.map((link) => {
            const meta = select.platformByKey(link.platform);
            return (
              <a
                key={link.platform}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Listen to ${release.title} on ${meta?.name ?? link.platform}`}
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-gold hover:text-gold"
              >
                <PlatformIcon platform={link.platform} className="size-4" />
              </a>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}
