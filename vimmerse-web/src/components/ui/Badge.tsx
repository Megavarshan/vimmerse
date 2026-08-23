import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "./Button"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-[var(--color-electric-violet)]",
        glow: "border-transparent bg-[var(--color-electric-violet)] text-white shadow-[0_0_10px_rgba(124,58,237,0.6)]",
        glass: "border-white/10 bg-black/40 backdrop-blur-md text-white",
        success: "border-transparent bg-[var(--color-emerald)] text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
