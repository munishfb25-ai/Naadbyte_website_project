import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { cn } from "@/lib/utils";

/**
 * Shared shell for every non-home page: fixed navbar, page body, footer.
 * The homepage keeps its own composition so its design stays untouched.
 */
export function PageLayout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <main className={cn("pt-28 md:pt-32", className)}>{children}</main>
      <Footer />
    </div>
  );
}

/** Consistent page header used across all inner pages. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string | undefined;
  title: string;
  subtitle?: string | undefined;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden py-14 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl bg-[radial-gradient(circle,oklch(0.82_0.135_82/0.55),transparent_65%)]"
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 lg:px-8"
      >
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1 className="max-w-4xl text-balance text-4xl leading-tight md:text-6xl">{title}</h1>
        {subtitle ? (
          <p className="max-w-2xl text-pretty text-sm text-muted-foreground md:text-base">
            {subtitle}
          </p>
        ) : null}
        {children}
      </motion.div>
    </header>
  );
}

/** Standard vertical rhythm wrapper for page content blocks. */
export function PageSection({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string | undefined;
  id?: string | undefined;
}) {
  return (
    <section id={id} className={cn("relative py-14 md:py-20", className)}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 lg:px-8">{children}</div>
    </section>
  );
}
