import { createFileRoute } from "@tanstack/react-router";
import { PageLayout, PageHeader, PageSection } from "@/components/layout/PageLayout";
import { legalContent, termsPage } from "@/content/pages";
import { pageMeta, withBrand } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: pageMeta({
      title: withBrand("Terms of Service"),
      description: termsPage.description,
    }),
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageLayout>
      <PageHeader
        eyebrow={termsPage.eyebrow}
        title={termsPage.title}
        subtitle={termsPage.subtitle}
      />
      <PageSection>
        <div className="flex max-w-3xl flex-col gap-8">
          {legalContent.terms.map((block) => (
            <article key={block.title} className="flex flex-col gap-2">
              <h2 className="font-display text-2xl">{block.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{block.body}</p>
            </article>
          ))}
        </div>
      </PageSection>
    </PageLayout>
  );
}
