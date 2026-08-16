import { motion } from "framer-motion";
import type { Video } from "@/types";

/** Reusable video tile — identical markup to the original Videos section. */
export function VideoCard({ video, index = 0 }: { video: Video; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-deep transition-all duration-500 hover:-translate-y-2 hover:border-gold/40"
    >
      <div className="aspect-video w-full overflow-hidden bg-surface">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.videoId}`}
          title={video.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full border-0"
        />
      </div>
      <div className="flex flex-col gap-1 p-5">
        <h3 className="font-display text-xl leading-tight">{video.title}</h3>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {video.description}
        </p>
      </div>
    </motion.article>
  );
}
