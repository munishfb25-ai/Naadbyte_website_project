import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { HeroGenresBar } from "@/components/sections/HeroGenresBar";
import { LatestReleases } from "@/components/sections/LatestReleases";
import { OriginalTracksSection } from "@/components/sections/OriginalTracksSection";
import { Videos } from "@/components/sections/Videos";
import { About } from "@/components/sections/About";
import { Platforms } from "@/components/sections/Platforms";
import { siteConfig } from "@/data/site";
import { routes } from "@/data/routes";

const title = "NaadByte — Music Beyond Boundaries";
const description =
  "Independent music label producing original devotional, cinematic, motivational, EDM, lo-fi and instrumental music in Hindi, English and Punjabi.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MusicGroup",
          name: siteConfig.name,
          description: siteConfig.description,
          genre: [
            "Devotional",
            "Cinematic",
            "Motivational",
            "EDM",
            "Progressive House",
            "Trance",
            "Lo-Fi",
            "Rap",
            "Instrumental",
          ],
          url: siteConfig.url,
        }),
      },
    ],
  }),
  component: HomePage,
});

/** Homepage = preview sections only; each links to its dedicated page. */
function HomePage() {
  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <main>
        <Hero />
        <HeroGenresBar />
        <LatestReleases />
        <OriginalTracksSection />
        <Videos limit={3} viewAllTo={routes.videos} />
        <About />
        <Platforms />
      </main>

      <Footer />
    </div>
  );
}
