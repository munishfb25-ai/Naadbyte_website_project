import { Link } from "@tanstack/react-router";
import { footerContent } from "@/content/sections";
import { siteConfig } from "@/data/site";
import { select } from "@/services";
import { BrandLogo } from "@/components/common/BrandLogo";
import { PlatformIcon } from "@/components/common/PlatformIcon";
import { Newsletter } from "@/components/sections/Newsletter";

export function Footer() {
  return (
    <footer id="contact" className="relative border-t border-border bg-surface/40">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-5 lg:col-span-1">
          <BrandLogo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {footerContent.about}
          </p>
          <ul className="flex items-center gap-3">
            {select.socialPlatforms().map((social) => (
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

        <Newsletter className="lg:col-span-2" />

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 lg:col-span-1">
          {footerContent.columns.map((column) => (
            <div key={column.id} className="flex flex-col gap-3">
              <h3 className="text-[0.65rem] uppercase tracking-[0.24em] text-gold">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row lg:px-8">
          <p>{siteConfig.copyright}</p>
          <p>{siteConfig.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
