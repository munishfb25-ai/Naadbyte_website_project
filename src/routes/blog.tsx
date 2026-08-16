import { createFileRoute } from "@tanstack/react-router";
import { PageLayout, PageHeader, PageSection } from "@/components/layout/PageLayout";
import { BlogCard } from "@/components/cards/BlogCard";
import { select } from "@/services";
import { blogPage } from "@/content/pages";
import { pageMeta, withBrand } from "@/lib/seo";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: pageMeta({
      title: withBrand("Blog"),
      description: blogPage.description,
    }),
  }),
  component: BlogPage,
});

function BlogPage() {
  const posts = select.blogPosts();

  return (
    <PageLayout>
      <PageHeader eyebrow={blogPage.eyebrow} title={blogPage.title} subtitle={blogPage.subtitle} />
      <PageSection>
        {posts.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            New writing is on the way. Check back soon.
          </p>
        )}
      </PageSection>
    </PageLayout>
  );
}
