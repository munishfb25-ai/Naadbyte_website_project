import { motion } from "framer-motion";
import { platformsContent } from "@/content/sections";
import { select } from "@/services";
import { SectionHeading } from "@/components/common/SectionHeading";
import { PlatformIcon } from "@/components/common/PlatformIcon";

export function Platforms() {
  return (
    <section className="relative py-24 md:py-28">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 lg:px-8">
        <SectionHeading
          eyebrow={platformsContent.eyebrow}
          title={platformsContent.title}
          subtitle={platformsContent.subtitle}
        />
        <motion.ul
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="glass-panel mx-auto flex w-full flex-wrap items-center justify-center gap-4 rounded-3xl p-8 sm:gap-8"
        >
          {select.listenPlatforms().map((platform) => (
            <li key={platform.key}>
              <a
                href={platform.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={platform.name}
                title={platform.name}
                className="flex size-14 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:text-gold sm:size-16"
              >
                <PlatformIcon platform={platform.key} className="size-6 sm:size-7" />
              </a>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
