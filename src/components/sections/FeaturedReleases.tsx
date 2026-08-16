import { useQuery } from "@tanstack/react-query";
import { releasesContent } from "@/content/sections";
import { select, contentService } from "@/services";
import { getVideosServerFn } from "@/services/server-functions";
import { SectionHeading } from "@/components/common/SectionHeading";
import { AlbumCard } from "@/components/cards/AlbumCard";
import { ViewAllLink } from "@/components/common/RouteLink";
import type { RoutePath } from "@/data/routes";
import type { Album } from "@/types";

/**
 * Featured releases grid. Pass `limit` + `viewAllTo` to render it as a
 * homepage preview; omit both to render the full list on a dedicated page.
 */
export function FeaturedReleases({
  limit,
  viewAllTo,
  viewAllLabel,
}: {
  limit?: number;
  viewAllTo?: RoutePath;
  viewAllLabel?: string;
} = {}) {
  const { data: videoData } = useQuery({
    queryKey: ["featured-latest-video"],
    queryFn: () => getVideosServerFn(),
  });

  const videos = videoData?.videos;
  const featuredAlbums = select.featuredAlbums(limit);
  const displayAlbums = [...featuredAlbums];

  if (videos && videos.length > 0) {
    const latestVideo = videos[0];
    if (latestVideo) {
      const videoAsAlbum: Album = {
        id: latestVideo.id,
        title: latestVideo.title,
        slug: `video-${latestVideo.videoId}`,
        ...(latestVideo.publishedAt ? { releaseDate: latestVideo.publishedAt } : {}),
        year: latestVideo.publishedAt
          ? new Date(latestVideo.publishedAt).getFullYear().toString()
          : "",
        genre: "Video",
        artistIds: ["NaadByte"],
        genreIds: [],
        songIds: [],
        description: latestVideo.description || "Watch the latest music video",
        cover: {
          src:
            latestVideo.thumbnail ||
            `https://img.youtube.com/vi/${latestVideo.videoId}/maxresdefault.jpg`,
          alt: latestVideo.title,
        },
        streamingLinks: [
          { platform: "youtube", href: `https://www.youtube.com/watch?v=${latestVideo.videoId}` },
        ],
        status: "published",
      };
      displayAlbums.unshift(videoAsAlbum);
      if (limit && displayAlbums.length > limit) {
        displayAlbums.pop();
      }
    }
  }

  return (
    <section id="releases" className="relative py-24 md:py-32">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-5 lg:px-8">
        <SectionHeading
          eyebrow={releasesContent.eyebrow}
          title={releasesContent.title}
          subtitle={releasesContent.subtitle}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayAlbums.map((release, i) => (
            <AlbumCard key={release.id} release={release} index={i} />
          ))}
        </div>
        {viewAllTo ? (
          <ViewAllLink to={viewAllTo} label={viewAllLabel ?? "View All Releases"} />
        ) : null}
      </div>
    </section>
  );
}
