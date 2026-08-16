import { motion } from "framer-motion";
import { aboutContent } from "@/content/sections";
import { brandAssets } from "@/data/assets";
import { SectionHeading } from "@/components/common/SectionHeading";

export function About() {
  return (
    <section id="about" className="relative overflow-hidden py-24 md:py-36 bg-background">
      {/* Background Image & Immersive Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={brandAssets.flagshipStudioBackground}
          alt="Flagship studio environment backdrop"
          className="size-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background/70" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-14 px-5 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className="flex flex-col gap-8">
          <SectionHeading eyebrow={aboutContent.eyebrow} title={aboutContent.title} align="left" />
          {aboutContent.story.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="text-pretty text-sm leading-relaxed text-muted-foreground md:text-base"
            >
              {paragraph}
            </motion.p>
          ))}
          <dl className="grid grid-cols-3 gap-4 border-t border-border pt-8">
            {aboutContent.stats.map((stat) => (
              <div key={stat.id} className="flex flex-col gap-1">
                <dt className="order-2 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="order-1 font-display text-4xl text-gold-gradient">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col gap-6">
          <motion.img
            src={brandAssets.logo}
            alt={brandAssets.logoAlt}
            loading="lazy"
            width={520}
            height={240}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto h-28 w-auto object-contain md:h-36 filter drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          />
          {aboutContent.pillars.map((pillar, i) => (
            <motion.article
              key={pillar.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="glass-panel rounded-2xl p-7 border border-gold/20 bg-card/60 backdrop-blur-xl shadow-xl"
            >
              <h3 className="font-display text-2xl text-gold">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
