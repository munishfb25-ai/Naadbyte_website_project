import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { PageLayout, PageHeader, PageSection } from "@/components/layout/PageLayout";
import { Field, TextInput, TextArea, SubmitButton } from "@/components/common/FormField";
import { PlatformIcon } from "@/components/common/PlatformIcon";
import { select } from "@/services";
import { siteConfig } from "@/data/site";

import { contactPage } from "@/content/pages";
import { pageMeta, withBrand } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: pageMeta({
      title: withBrand("Contact"),
      description: contactPage.description,
    }),
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const socials = select.socialPlatforms();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Wired to a server function / CMS endpoint in a later iteration.
    setSent(true);
    e.currentTarget.reset();
  };

  return (
    <PageLayout>
      <PageHeader
        eyebrow={contactPage.eyebrow}
        title={contactPage.title}
        subtitle={contactPage.subtitle}
      />

      <PageSection>
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name" htmlFor="contact-name">
                <TextInput id="contact-name" name="name" required placeholder="Full name" />
              </Field>
              <Field label="Email" htmlFor="contact-email">
                <TextInput
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                />
              </Field>
            </div>
            <Field label="Subject" htmlFor="contact-subject">
              <TextInput
                id="contact-subject"
                name="subject"
                placeholder="Licensing, collaboration, press…"
              />
            </Field>
            <Field label="Message" htmlFor="contact-message">
              <TextArea
                id="contact-message"
                name="message"
                required
                placeholder="Tell us what you have in mind."
              />
            </Field>
            <div className="flex flex-wrap items-center gap-4">
              <SubmitButton>Send Message</SubmitButton>
              {sent ? (
                <p role="status" className="text-xs text-gold">
                  Thank you — we'll be in touch shortly.
                </p>
              ) : null}
            </div>
          </form>

          <aside className="flex flex-col gap-6">
            <div className="glass-panel rounded-2xl p-6">
              <h2 className="font-display text-2xl">Direct</h2>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold"
              >
                <Mail className="size-4" aria-hidden />
                {siteConfig.email}
              </a>
            </div>
            <div className="glass-panel rounded-2xl p-6">
              <h2 className="font-display text-2xl">Follow</h2>
              <ul className="mt-4 flex flex-wrap items-center gap-3">
                {socials.map((social) => (
                  <li key={social.key}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={social.name}
                      className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-gold hover:text-gold"
                    >
                      <PlatformIcon platform={social.key} className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </PageSection>
    </PageLayout>
  );
}
