import { createFileRoute } from "@tanstack/react-router";
import { PageLayout, PageHeader } from "@/components/layout/PageLayout";
import { RouteLink } from "@/components/common/RouteLink";
import { routes } from "@/data/routes";
import { notFoundPage } from "@/content/pages";
import { pageMeta, withBrand } from "@/lib/seo";

/** Catch-all: any unmatched URL renders the branded 404 page. */
export const Route = createFileRoute("/$")({
  head: () => ({
    meta: pageMeta({
      title: withBrand("Page Not Found"),
      description: notFoundPage.description,
      noindex: true,
    }),
  }),
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <PageLayout>
      <PageHeader
        eyebrow={notFoundPage.eyebrow}
        title={notFoundPage.title}
        subtitle={notFoundPage.subtitle}
      >
        <div className="flex flex-wrap gap-3 pt-4">
          <RouteLink to={routes.home}>Back Home</RouteLink>
          <RouteLink to={routes.music} variant="outline">
            Browse Music
          </RouteLink>
        </div>
      </PageHeader>
    </PageLayout>
  );
}
