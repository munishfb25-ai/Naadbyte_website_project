import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string | undefined;
  title: string;
  subtitle?: string | undefined;
  align?: "center" | "left";
  className?: string | undefined;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <div className={cn("flex items-center gap-3", align === "center" && "justify-center")}>
        <span className="h-px w-10 bg-gold-gradient opacity-70" />
        <span className="size-1.5 rotate-45 bg-gold-gradient" />
        <span className="h-px w-10 bg-gold-gradient opacity-70" />
      </div>
      <h2 className="max-w-3xl text-balance text-4xl leading-tight md:text-5xl">{title}</h2>
      {subtitle ? (
        <p className="max-w-2xl text-pretty text-sm text-muted-foreground md:text-base">
          {subtitle}
        </p>
      ) : null}
    </motion.header>
  );
}
