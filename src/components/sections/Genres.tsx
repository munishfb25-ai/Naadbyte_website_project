import { genresContent } from "@/content/sections";
import { select } from "@/services";
import { SectionHeading } from "@/components/common/SectionHeading";
import { GenreCard } from "@/components/cards/GenreCard";
import { ViewAllLink } from "@/components/common/RouteLink";
import type { RoutePath } from "@/data/routes";

export function Genres({
  limit,
  viewAllTo,
  viewAllLabel,
}: {
  limit?: number;
  viewAllTo?: RoutePath;
  viewAllLabel?: string;
} = {}) {
  return (
    <section id="genres" className="relative py-24 md:py-32">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,oklch(0.82_0.135_82/0.35),transparent)]"
      />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-5 lg:px-8">
        <SectionHeading
          eyebrow={genresContent.eyebrow}
          title={genresContent.title}
          subtitle={genresContent.subtitle}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {select.genres(limit).map((genre, i) => (
            <GenreCard key={genre.id} genre={genre} index={i} />
          ))}
        </div>
        {viewAllTo ? <ViewAllLink to={viewAllTo} label={viewAllLabel ?? "View All Music"} /> : null}
      </div>
    </section>
  );
}
