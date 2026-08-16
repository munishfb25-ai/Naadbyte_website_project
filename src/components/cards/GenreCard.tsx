import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Genre } from "@/types";

const MotionLink = motion.create(Link);

export function GenreCard({ genre, index = 0 }: { genre: Genre; index?: number }) {
  return (
    <MotionLink
      to={genre.href}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
      className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-2xl border border-border shadow-deep transition-all duration-500 hover:-translate-y-2 hover:border-gold/40"
    >
      <img
        src={genre.image.src}
        alt=""
        aria-hidden
        loading="lazy"
        width={768}
        height={768}
        className="absolute inset-0 size-full object-cover opacity-70 transition-all duration-700 group-hover:scale-110 group-hover:opacity-95"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.12_0.012_60/0.97),oklch(0.12_0.012_60/0.55)_45%,oklch(0.12_0.012_60/0.15))]"
      />
      <div className="relative z-10 flex flex-col gap-2 p-5">
        <h3 className="font-display text-2xl leading-none">{genre.name}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{genre.description}</p>
        <span className="mt-2 flex size-8 items-center justify-center rounded-full border border-gold/40 text-gold transition-all duration-300 group-hover:bg-gold-gradient group-hover:text-primary-foreground">
          <ArrowRight className="size-4" aria-hidden />
        </span>
      </div>
    </MotionLink>
  );
}
