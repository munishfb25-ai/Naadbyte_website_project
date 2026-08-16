import { createServerFn } from "@tanstack/react-start";
import { contentService } from "@/services/content-service";

export const getVideosServerFn = createServerFn({ method: "GET" })
  .validator((data?: { pageToken?: string | undefined }) => data)
  .handler(async ({ data }) => {
    return await contentService.getVideos(data?.pageToken);
  });
