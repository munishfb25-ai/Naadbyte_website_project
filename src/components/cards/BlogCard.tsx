import { motion } from "framer-motion";
import type { BlogPost } from "@/types";

/** Reusable blog teaser. Detail pages can be added without changing this. */
export function BlogCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-deep transition-all duration-500 hover:-translate-y-2 hover:border-gold/40"
    >
      <span className="text-[0.6rem] uppercase tracking-[0.2em] text-gold">
        {post.categories?.[0] ?? "Journal"}
      </span>
      <h3 className="font-display text-2xl leading-tight">{post.title}</h3>
      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
      <p className="text-xs text-muted-foreground">
        {post.publishedAt}
        {post.readingMinutes ? ` · ${post.readingMinutes} min read` : ""}
      </p>
    </motion.article>
  );
}
