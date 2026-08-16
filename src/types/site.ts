import type { LinkRef, SectionContent } from "./common";

/** Primary/secondary navigation entry. */
export type NavItem = { label: string; href: string };

/** Global brand + SEO configuration. */
export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  foundedYear: number;
  copyright: string;
};

/** Hero section copy (design-locked: text only, no layout data). */
export type HeroContent = SectionContent & {
  headline: [string, string];
  primaryCta: LinkRef;
  secondaryCta: LinkRef;
  scrollHint: string;
};

/** Newsletter section copy. */
export type NewsletterContent = SectionContent & {
  placeholder: string;
  cta: string;
  successMessage: string;
};

/** Footer copy and link columns. */
export type FooterContent = {
  about: string;
  columns: { id: string; title: string; links: LinkRef[] }[];
};

/** About section copy. */
export type AboutContent = SectionContent & {
  story: string[];
  pillars: { id: string; title: string; body: string }[];
  stats: { id: string; value: string; label: string }[];
};
