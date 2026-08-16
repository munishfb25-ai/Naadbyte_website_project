import { createFileRoute } from "@tanstack/react-router";
import { PageLayout, PageHeader, PageSection } from "@/components/layout/PageLayout";
import { legalContent, privacyPage } from "@/content/pages";
import { pageMeta, withBrand } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: pageMeta({
      title: withBrand("Privacy Policy"),
      description: privacyPage.description,
    }),
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageLayout>
      <PageHeader
        eyebrow={privacyPage.eyebrow}
        title={privacyPage.title}
        subtitle={privacyPage.subtitle}
      />
      <PageSection>
        <div className="flex max-w-3xl flex-col gap-8">
          {legalContent.privacy.map((block) => (
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
