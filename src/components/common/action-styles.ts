import { cva } from "class-variance-authority";

/**
 * Shared button/link variants used by both `ActionLink` (plain anchors) and
 * `RouteLink` (router links). Kept in its own module so component files export
 * components only.
 */
export const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        gold: "bg-gold-gradient text-primary-foreground glow-gold hover:brightness-110 hover:-translate-y-0.5",
        outline:
          "border border-border text-foreground hover:border-gold hover:text-gold hover:-translate-y-0.5",
        ghost: "text-muted-foreground hover:text-gold",
      },
      size: {
        sm: "px-4 py-2 text-xs uppercase tracking-[0.18em]",
        md: "px-6 py-3 text-sm uppercase tracking-[0.18em]",
        lg: "px-8 py-4 text-sm uppercase tracking-[0.22em]",
      },
    },
    defaultVariants: { variant: "gold", size: "md" },
  },
);
