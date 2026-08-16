/**
 * All editorial copy for the homepage sections.
 * Kept separate from catalogue data (albums/songs/…) so a CMS can map
 * "pages/blocks" here and "custom post types" to `src/data/*`.
 */

import { routes } from "@/data/routes";
import type {
  AboutContent,
  FooterContent,
  HeroContent,
  NewsletterContent,
  SectionContent,
} from "@/types";

export const heroContent: HeroContent = {
  eyebrow: "Music Beyond Boundaries",
  title: "Every Emotion Has a Soundtrack",
  headline: ["Every Emotion Has", "a Soundtrack"],
  subtitle: "Original music that inspires, energizes and connects across every genre.",
  primaryCta: { label: "Listen Now", href: "#releases" },
  secondaryCta: { label: "Explore Music", href: "#genres" },
  scrollHint: "Scroll",
};

/**
 * Flagship bespoke-commission section (homepage, directly after the hero).
 * A CMS can map this to a single "block" with a repeater of process steps.
 */
export type CreateYourSongSectionContent = SectionContent & {
  intro: string;
  occasions: string[];
  steps: { id: string; title: string; body: string }[];
  benefits: { id: string; title: string; body: string }[];
  experience: { quote: string; attribution: string };
  cta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  note: string;
};

export const createYourSongSection: CreateYourSongSectionContent = {
  eyebrow: "Bespoke Music",
  title: "Turn Your Story Into an Original Song",
  subtitle:
    "Tell us your moment. Our composers write, record, and master an original studio track made only for you.",
  intro:
    "Original music crafted around your people, your memory, and your moment — in Hindi, English, or Punjabi.",
  occasions: [
    "Weddings",
    "Birthdays",
    "Anniversaries",
    "Memorials & Tributes",
    "Spiritual Journeys",
    "Romance & Milestones",
    "Films & Brands",
  ],
  steps: [
    {
      id: "story",
      title: "Share Your Story",
      body: "Describe your memories, emotions, and milestone details in a simple guided flow.",
    },
    {
      id: "compose",
      title: "We Compose & Record",
      body: "Our writers and live vocalists shape original melody and lyrics around your feeling.",
    },
    {
      id: "review",
      title: "You Review & Refine",
      body: "Listen to the private first cut and refine words or tempo until it feels perfect.",
    },
    {
      id: "alive",
      title: "Delivered in Studio Quality",
      body: "Receive your label-mastered track, ready to play at your event, gift, or stream.",
    },
  ],
  benefits: [
    {
      id: "original",
      title: "Original Composition",
      body: "Unique melodies and bespoke lyrics crafted specifically for your story, never templated or recycled.",
    },
    {
      id: "voices",
      title: "Real Musicians",
      body: "Performed by live studio vocalists and instrumentalists in Hindi, English, and Punjabi.",
    },
    {
      id: "studio",
      title: "Studio-Grade Production",
      body: "Mixed and mastered to premier label standards in pristine high-fidelity audio.",
    },
    {
      id: "yours",
      title: "Yours Forever",
      body: "Complete personal ownership to cherish, gift privately, or release worldwide.",
    },
  ],
  experience: {
    quote:
      "They didn't just give us a song. They captured the morning we got married—the light, the nervousness, the sacred tears. Everyone cried before the first chorus.",
    attribution: "A bespoke wedding commission · Amritsar",
  },
  cta: { label: "Begin Your Song", href: routes.createYourSong },
  secondaryCta: { label: "See How It Works", href: "#how-it-works" },
  note: "Commissioned like fine art · Limited studio slots available each month",
};

export const releasesContent: SectionContent = {
  eyebrow: "Featured Releases",
  title: "Latest From the Label",
  subtitle: "Newly released records, mastered for every listening room.",
};

export const genresContent: SectionContent = {
  eyebrow: "Browse Genres",
  title: "Sound For Every Feeling",
  subtitle: "From temple chants to festival mainstages — one label, many languages.",
};

export const videosContent: SectionContent & {
  channelCta: { label: string; href: string };
} = {
  eyebrow: "Latest Videos",
  title: "Watch the Sound",
  subtitle: "Visual worlds built around every NaadByte release.",
  channelCta: { label: "Visit our channel", href: "https://youtube.com" },
};

export const aboutContent: AboutContent = {
  eyebrow: "About NaadByte",
  title: "Sound That Moves. Stories That Stay.",
  story: [
    "NaadByte is an independent music label built on a simple belief — sound is the shortest distance between two hearts. 'Naad' is the primordial vibration; 'Byte' is the modern world it now travels through.",
    "We produce original music across devotional, cinematic, motivational, EDM, progressive house, trance, lo-fi, rap and instrumental work — in Hindi, English and Punjabi.",
  ],
  pillars: [
    {
      id: "mission",
      title: "Our Mission",
      body: "To create original music that carries emotion across languages, cultures and platforms — released to the world without gatekeepers.",
    },
    {
      id: "vision",
      title: "Our Vision",
      body: "To become the home of boundary-free sound, where a devotional chant and a festival anthem can live under one label.",
    },
  ],
  stats: [
    { id: "genres", value: "12+", label: "Genres produced" },
    { id: "languages", value: "3", label: "Languages" },
    { id: "platforms", value: "9", label: "Streaming platforms" },
  ],
};

export const platformsContent: SectionContent = {
  eyebrow: "Listen Everywhere",
  title: "Available on Every Platform",
  subtitle: "Stream NaadByte wherever you already listen.",
};

export const newsletterContent: NewsletterContent = {
  eyebrow: "Stay Connected",
  title: "New Music, First.",
  subtitle: "Subscribe for new releases, behind-the-scenes sessions and early access.",
  placeholder: "Enter your email",
  cta: "Subscribe",
  successMessage: "You're on the list. Welcome to NaadByte.",
};

export const footerContent: FooterContent = {
  about:
    "We create music that transcends boundaries and connects hearts. Cinematic. Devotional. Electronic. Ambient. Inspirational.",
  columns: [
    {
      id: "explore",
      title: "Explore",
      links: [
        { label: "Home", href: routes.home },
        { label: "Music", href: routes.music },
        { label: "Videos", href: routes.videos },
        { label: "Releases", href: routes.releases },
      ],
    },
    {
      id: "company",
      title: "Company",
      links: [
        { label: "About", href: routes.about },
        { label: "Bespoke Music", href: routes.createYourSong },
        { label: "Blog", href: routes.blog },
        { label: "Contact", href: routes.contact },
        { label: "Privacy Policy", href: routes.privacy },
        { label: "Terms", href: routes.terms },
      ],
    },
  ],
};
