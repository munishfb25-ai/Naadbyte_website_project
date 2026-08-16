import { Link, type LinkComponentProps } from "@tanstack/react-router";
import { type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import { buttonStyles } from "./action-styles";
import { cn } from "@/lib/utils";

/**
 * Internal navigation styled exactly like `ActionLink`, but routed through
 * TanStack Router (client-side navigation, preloading, type-safe paths).
 */
export type RouteLinkProps = LinkComponentProps<"a"> & VariantProps<typeof buttonStyles>;

export function RouteLink({ className, variant, size, ...props }: RouteLinkProps) {
  return <Link className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}

/** The "View All" affordance used at the bottom of every homepage preview. */
export function ViewAllLink({
  label = "View All",
  className,
  ...props
}: RouteLinkProps & { label?: string }) {
  return (
    <div className={cn("flex justify-center", className)}>
      <RouteLink variant="outline" {...props}>
        {label}
        <ArrowRight className="size-4" aria-hidden />
      </RouteLink>
    </div>
  );
}
