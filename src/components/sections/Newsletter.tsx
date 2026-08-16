import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { newsletterContent } from "@/content/sections";
import { cn } from "@/lib/utils";

export function Newsletter({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setEmail("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className={cn("flex flex-col gap-4", className)}
    >
      <span className="eyebrow">{newsletterContent.eyebrow}</span>
      <h2 className="font-display text-3xl md:text-4xl">{newsletterContent.title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{newsletterContent.subtitle}</p>
      <form
        onSubmit={onSubmit}
        className="flex w-full max-w-md items-center gap-2 rounded-full border border-input bg-surface p-1.5"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={newsletterContent.placeholder}
          className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="rounded-full bg-gold-gradient px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-primary-foreground transition-all hover:brightness-110"
        >
          {newsletterContent.cta}
        </button>
      </form>
      {sent ? (
        <p role="status" className="text-xs text-gold">
          {newsletterContent.successMessage}
        </p>
      ) : null}
    </motion.div>
  );
}
