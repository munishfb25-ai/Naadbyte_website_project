import { cn } from "@/lib/utils";
import { brandAssets } from "@/data/assets";
import { siteConfig } from "@/data/site";

export function BrandLogo({
  className,
  showWordmark = true,
  markClassName,
}: {
  className?: string;
  showWordmark?: boolean;
  markClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <img
        src={brandAssets.logo}
        alt={brandAssets.logoAlt}
        width={160}
        height={160}
        className={cn("h-10 w-auto object-contain", markClassName)}
      />
      {showWordmark ? (
        <span className="font-display text-2xl tracking-wide text-gold-gradient">
          {siteConfig.name}
        </span>
      ) : null}
    </span>
  );
}
