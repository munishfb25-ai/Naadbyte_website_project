import type { VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { buttonStyles } from "./action-styles";

export type ActionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonStyles>;

export function ActionLink({ className, variant, size, ...props }: ActionLinkProps) {
  return <a className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}
