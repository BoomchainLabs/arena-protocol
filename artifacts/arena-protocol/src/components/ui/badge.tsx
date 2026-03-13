import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 clip-edges",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/20 text-primary border border-primary/50 shadow-[0_0_10px_hsl(var(--primary)/0.2)]",
        secondary:
          "border-transparent bg-secondary/20 text-secondary border border-secondary/50",
        destructive:
          "border-transparent bg-destructive/20 text-destructive border border-destructive/50",
        outline: "text-foreground border-border",
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
