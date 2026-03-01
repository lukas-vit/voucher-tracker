import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

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
          "border-red-500/30 bg-red-500/15 text-red-300",
        outline: "text-foreground",
        warning:
          "border-amber-500/30 bg-amber-500/15 text-amber-300",
        success:
          "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
        food: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
        retail: "border-blue-500/30 bg-blue-500/15 text-blue-300",
        travel: "border-violet-500/30 bg-violet-500/15 text-violet-300",
        entertainment: "border-pink-500/30 bg-pink-500/15 text-pink-300",
        other: "border-gray-500/30 bg-gray-500/15 text-gray-300",
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

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
