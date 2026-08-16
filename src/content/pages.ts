/**
 * Copy for every dedicated page. Kept beside `sections.ts` so a CMS can map
 * "pages" here without touching components.
 */

import type { SectionContent } from "@/types";
import { siteConfig } from "@/data/site";

type PageCopy = SectionContent & { description: string };

export const musicPage: PageCopy = {
  eyebrow: "The Catalogue",
  title: "Music",
  subtitle:
    "Every NaadByte track — devotional, cinematic, motivational, electronic and instrumental.",
  description: "Browse the complete NaadByte song catalogue across Hindi, English and Punjabi.",
};

export const releasesPage: PageCopy = {
  eyebrow: "Discography",
  title: "Releases",
  subtitle: "Albums, EPs and singles released by the label.",
  description: "All NaadByte albums, EPs and singles with streaming links for every platform.",
};

export const videosPage: PageCopy = {
  eyebrow: "Watch",
  title: "Videos",
  subtitle: "Visualizers, live sessions and motion films built around our music.",
  description: "Official NaadByte music videos, visualizers and live sessions.",
};

export const aboutPage: PageCopy = {
  eyebrow: "About NaadByte",
  title: "The Label",
  subtitle: "Independent, boundary-free and built around emotion.",
  description: "The story, mission and vision behind NaadByte — an independent music label.",
};

export const contactPage: PageCopy = {
  eyebrow: "Get in Touch",
  title: "Contact",
  subtitle: "Licensing, collaborations, press or bespoke music — we read everything.",
  description: `Contact NaadByte for licensing, collaborations and press. Email ${siteConfig.email}.`,
};

export const createYourSongPage: PageCopy = {
  eyebrow: "Bespoke Music",
  title: "Create Your Song",
  subtitle: "Tell us the moment. We write, produce and master an original track around it.",
  description:
    "Commission an original, bespoke song from NaadByte for weddings, brands, films and personal milestones.",
};

export const blogPage: PageCopy = {
  eyebrow: "Journal",
  title: "Blog",
  subtitle: "Studio notes, production breakdowns and stories behind the sound.",
  description:
    "Behind-the-scenes writing from the NaadByte studio — production notes and release stories.",
};

export const privacyPage: PageCopy = {
  eyebrow: "Legal",
  title: "Privacy Policy",
  subtitle: "How we collect, use and protect your information.",
  description: "NaadByte privacy policy.",
};

export const termsPage: PageCopy = {
  eyebrow: "Legal",
  title: "Terms of Service",
  subtitle: "The terms that govern the use of this website and our music.",
  description: "NaadByte terms of service.",
};

export const notFoundPage: PageCopy = {
  eyebrow: "404",
  title: "This Track Doesn't Exist",
  subtitle: "The page you're looking for has moved, or was never released.",
  description: "Page not found.",
};

/** Legal body copy — plain sections, editable without touching components. */
export const legalContent = {
  privacy: [
    {
      title: "Information We Collect",
      body: "We collect only what you give us: your name and email when you subscribe to our newsletter, contact us, or submit a bespoke song request. Basic, anonymised analytics help us understand which releases people listen to.",
    },
    {
      title: "How We Use It",
      body: "Your details are used to reply to you, deliver requested music, and — if you opted in — send occasional release announcements. We never sell or rent personal data.",
    },
    {
      title: "Third-Party Services",
      body: "Streaming and video players embedded on this site (Spotify, Apple Music, YouTube and others) are governed by their own privacy policies.",
    },
    {
      title: "Your Rights",
      body: `You can request access to, correction of, or deletion of your data at any time by writing to ${siteConfig.email}.`,
    },
  ],
  terms: [
    {
      title: "Use of This Website",
      body: "This site and its content are provided for personal, non-commercial use. You may share links freely.",
    },
    {
      title: "Music Licensing",
      body: "All recordings, compositions and artwork are owned by NaadByte. Commercial use — film, advertising, streaming content or public performance — requires a written licence.",
    },
    {
      title: "Bespoke Commissions",
      body: "Custom song requests are quoted individually. Delivery timelines, revisions and usage rights are confirmed in writing before production begins.",
    },
    {
      title: "Changes",
      body: "We may update these terms as the label grows. The version published on this page is the one in effect.",
    },
  ],
};
