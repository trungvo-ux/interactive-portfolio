"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { playSound } from "@/lib/sound";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full transition-[transform,background-color,color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  {
    variants: {
      variant: {
        nav: "size-[42px] text-ink hover:bg-black/[0.04]",
        navActive: "size-[42px] bg-[var(--nav-chip)] text-ink",
        glass:
          "size-11 bg-[rgba(210,210,215,0.64)] text-ink backdrop-blur-md hover:bg-[rgba(210,210,215,0.85)]",
        ghost: "size-11 text-ink hover:bg-black/[0.05]",
      },
    },
    defaultVariants: { variant: "nav" },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /** Skip the shared click sound — use when this click already triggers its
   * own bespoke sound (e.g. the passport's page-turn). */
  silent?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, type = "button", silent, onClick, ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(iconButtonVariants({ variant, className }))}
      onClick={(e) => {
        if (!silent) playSound("/sounds/click.mp3", 0.35);
        onClick?.(e);
      }}
      {...props}
    />
  )
);
IconButton.displayName = "IconButton";
