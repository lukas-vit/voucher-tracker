import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const CATEGORY_VARIANTS = [
  "food",
  "retail",
  "travel",
  "entertainment",
  "other",
] as const;

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-red-300 bg-red-100 text-[#7f1d1d] dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-300",
        outline: "text-foreground",
        warning:
          "border-amber-300 bg-amber-100 text-[#78350f] dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300",
        success:
          "border-emerald-300 bg-emerald-100 text-[#022c22] dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300",
        food:
          "border-emerald-300 bg-emerald-100 text-[#022c22] dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300",
        retail:
          "border-blue-300 bg-blue-100 text-[#172554] dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-300",
        travel:
          "border-violet-300 bg-violet-100 text-[#2e1065] dark:border-violet-500/30 dark:bg-violet-500/15 dark:text-violet-300",
        entertainment:
          "border-pink-300 bg-pink-100 text-[#4c0519] dark:border-pink-500/30 dark:bg-pink-500/15 dark:text-pink-300",
        other:
          "border-gray-300 bg-gray-100 text-[#0f172a] dark:border-gray-500/30 dark:bg-gray-500/15 dark:text-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, style, ...props }: BadgeProps) {
  const isCategory =
    variant &&
    CATEGORY_VARIANTS.includes(variant as (typeof CATEGORY_VARIANTS)[number]);
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      data-badge-category={isCategory ? "true" : undefined}
      style={
        isCategory
          ? { color: "var(--badge-category-text, #0f172a)", ...style }
          : style
      }
      {...props}
    />
  );
}

export { Badge, badgeVariants };
