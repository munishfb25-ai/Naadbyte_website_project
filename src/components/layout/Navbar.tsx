import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { navigation, siteConfig } from "@/data/site";
import { routes } from "@/data/routes";
import { BrandLogo } from "@/components/common/BrandLogo";
import { RouteLink } from "@/components/common/RouteLink";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "glass-panel border-x-0 border-t-0 py-2" : "py-4",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 lg:px-8"
      >
        <Link to={routes.home} className="shrink-0" aria-label={`${siteConfig.name} home`}>
          <BrandLogo />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                activeOptions={{ exact: item.href === routes.home }}
                activeProps={{ className: "text-gold" }}
                className="relative text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-gold after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold-gradient after:transition-all hover:after:w-full"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 md:gap-4 relative">
          <GlobalSearch />
          <RouteLink to={routes.music} size="sm" className="hidden sm:inline-flex shrink-0">
            Listen Now
          </RouteLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="rounded-full border border-border p-2 text-foreground transition-colors hover:text-gold lg:hidden shrink-0"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden lg:hidden"
          >
            <ul className="glass-panel mx-5 mt-3 flex flex-col gap-1 rounded-2xl p-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: item.href === routes.home }}
                    activeProps={{ className: "text-gold" }}
                    className="block rounded-xl px-4 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
