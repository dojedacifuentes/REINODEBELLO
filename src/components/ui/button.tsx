import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold uppercase tracking-[0.12em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary:
          "border border-amber-300/60 bg-amber-400/15 text-amber-100 shadow-[0_0_24px_rgba(245,158,11,0.22)] hover:bg-amber-300/25 hover:text-white",
        cyan:
          "border border-cyan-300/50 bg-cyan-400/12 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.18)] hover:bg-cyan-300/20",
        violet:
          "border border-violet-300/50 bg-violet-500/12 text-violet-100 shadow-[0_0_22px_rgba(139,92,246,0.18)] hover:bg-violet-400/20",
        red:
          "border border-rose-300/50 bg-rose-500/12 text-rose-100 shadow-[0_0_22px_rgba(244,63,94,0.18)] hover:bg-rose-400/20",
        ghost:
          "border border-white/10 bg-white/[0.035] text-slate-200 hover:border-white/25 hover:bg-white/[0.075]",
      },
      size: {
        sm: "h-9 px-3 text-[0.68rem]",
        md: "h-11 px-4 text-[0.72rem]",
        lg: "h-14 px-5 text-xs",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
