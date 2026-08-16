import type { NavItem, SiteConfig } from "@/types";
import { routes } from "./routes";

/**
 * Global site configuration. Components never hardcode brand copy.
 * NOTE: `foundedYear`/`copyright` are static so SSR and the browser always
 * render the same string.
 */
export const siteConfig: SiteConfig = {
  name: "NaadByte",
  tagline: "Music Beyond Boundaries",
  description:
    "NaadByte is an independent music label creating original devotional, cinematic, motivational, EDM, lo-fi and instrumental music across Hindi, English and Punjabi.",
  url: "https://naadbyte.com",
  email: "hello@naadbyte.com",
  foundedYear: 2026,
  copyright: "© 2026 NaadByte. All rights reserved.",
};

export const navigation: NavItem[] = [
  { label: "Home", href: routes.home },
  { label: "Custom Song", href: routes.createYourSong },
  { label: "Music", href: routes.music },
  { label: "Videos", href: routes.videos },

  { label: "Releases", href: routes.releases },
  { label: "About", href: routes.about },
  { label: "Contact", href: routes.contact },
];
