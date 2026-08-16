import { Globe, Mountain, Trees, Film, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { routes } from "@/data/routes";

export function HeroGenresBar() {
  const items = [
    {
      icon: Globe,
      title: "ENGLISH",
      subtitle: "Worldwide Vibes",
      genre: "english",
    },
    {
      icon: Mountain,
      title: "MOTIVATION",
      subtitle: "Rise. Focus. Achieve.",
      genre: "motivation",
    },
    {
      icon: Trees,
      title: "LIFE",
      subtitle: "Real Stories. Real Growth.",
      genre: "meditation",
    },
    {
      isOm: true,
      title: "DEVOTIONAL",
      subtitle: "Divine Energy. Sacred Sound.",
      genre: "devotional",
    },
    {
      icon: Film,
      title: "CINEMATIC",
      subtitle: "Epic. Emotional. Timeless.",
      genre: "cinematic",
    },
    {
      icon: Activity,
      title: "ELECTRONIC",
      subtitle: "Beats That Move You.",
      genre: "edm",
    },
  ];

  return (
    <section className="relative w-full bg-transparent py-8 px-4 lg:px-8 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-background/20 backdrop-blur-sm pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-0">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`relative ${
                  idx !== items.length - 1 ? "lg:border-r lg:border-gold/20" : ""
                }`}
              >
                <Link
                  to={routes.music}
                  search={{ genre: item.genre }}
                  className="flex flex-col items-center text-center px-4 py-3 group rounded-xl transition-all duration-300 hover:bg-gold/5"
                >
                  <div className="flex size-14 items-center justify-center rounded-full bg-transparent text-gold mb-3 border border-gold/40 group-hover:scale-110 group-hover:border-gold group-hover:bg-gold/10 transition-all">
                    {item.isOm ? (
                      <span className="font-display text-2xl font-bold text-gold tracking-tighter">
                        ॐ
                      </span>
                    ) : Icon ? (
                      <Icon className="size-6" strokeWidth={1.75} />
                    ) : null}
                  </div>
                  <h3 className="font-display text-sm md:text-base tracking-[0.2em] font-semibold text-gold mb-1 group-hover:text-gold-light transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-light group-hover:text-foreground/80 transition-colors">
                    {item.subtitle}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
