import { useQuery } from "@tanstack/react-query";
import { videosContent } from "@/content/sections";
import { contentService, select } from "@/services";
import { getVideosServerFn } from "@/services/server-functions";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ActionLink } from "@/components/common/ActionLink";
import { ViewAllLink } from "@/components/common/RouteLink";
import { VideoCard } from "@/components/cards/VideoCard";
import { brandAssets } from "@/data/assets";
import { Play, Youtube } from "lucide-react";
import type { RoutePath } from "@/data/routes";

export function Videos({
  limit,
  viewAllTo,
  viewAllLabel,
}: {
  limit?: number;
  viewAllTo?: RoutePath;
  viewAllLabel?: string;
} = {}) {
  const { data: videoData } = useQuery({
    queryKey: ["homepage-videos"],
    queryFn: () => getVideosServerFn(),
  });

  const videos = videoData?.videos;
  const displayVideos = videos ? videos.slice(0, limit) : select.videos(limit);
  const featuredVideo = displayVideos[0];
  const remainingVideos = displayVideos.slice(1);

  return (
    <section id="videos" className="relative py-24 md:py-36 overflow-hidden bg-background">
      {/* Background Image & Immersive Atmospheric Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={brandAssets.musicWorldsBackdrop}
          alt="Music worlds backdrop"
          className="size-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background/70" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-14 px-5 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            eyebrow={videosContent.eyebrow}
            title={videosContent.title}
            subtitle={videosContent.subtitle}
            align="left"
          />
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold backdrop-blur-md">
              <Youtube className="size-4 text-red-500 fill-current" />
              Official Channel
            </span>
          </div>
        </div>

        {/* Featured Video Large Showcase */}
        {featuredVideo && (
          <div className="relative rounded-3xl border border-gold/40 bg-card/60 backdrop-blur-xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] grid lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-10">
            <div className="lg:col-span-7 relative aspect-video w-full overflow-hidden rounded-2xl border border-gold/30 shadow-2xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${featuredVideo.videoId}`}
                title={featuredVideo.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="size-full border-0"
              />
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center gap-4">
              <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold uppercase tracking-wider border border-gold/30">
                <Play className="size-3 fill-current" /> Featured Visual
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                {featuredVideo.title}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {featuredVideo.description ||
                  "Experience our latest music video production featuring breathtaking cinematic cinematography and devotional soundscapes."}
              </p>
              <div className="pt-2">
                <ActionLink
                  href={videosContent.channelCta.href}
                  variant="outline"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="border-gold/40 hover:bg-gold hover:text-background transition-all"
                >
                  <Youtube className="size-4 text-red-500 fill-current" /> Watch on YouTube
                </ActionLink>
              </div>
            </div>
          </div>
        )}

        {/* Remaining Video Cards */}
        {remainingVideos.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {remainingVideos.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i + 1} />
            ))}
          </div>
        )}

        {viewAllTo ? (
          <ViewAllLink to={viewAllTo} label={viewAllLabel ?? "View All Videos"} />
        ) : (
          <div className="flex justify-center pt-4">
            <ActionLink
              href={videosContent.channelCta.href}
              variant="outline"
              target="_blank"
              rel="noreferrer noopener"
              className="border-gold/40 bg-gold/10 text-gold hover:bg-gold hover:text-background transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)]"
            >
              <Youtube className="size-4 mr-2" />
              {videosContent.channelCta.label}
            </ActionLink>
          </div>
        )}
      </div>
    </section>
  );
}
