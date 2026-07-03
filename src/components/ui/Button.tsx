"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { playSound } from "@/lib/sound";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-normal transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-accent text-white rounded-full",
        secondary:
          "bg-transparent text-accent border border-accent rounded-full",
        pearl:
          "bg-[#fafafc] text-[#333] border-[3px] border-black/[0.04] rounded-[11px]",
        link: "text-accent hover:underline underline-offset-4",
      },
      size: {
        md: "text-[17px] px-[22px] py-[11px]",
        sm: "text-[14px] px-4 py-2",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Skip the shared click sound — use when this click already triggers its
   * own bespoke sound. */
  silent?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", silent, onClick, ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={(e) => {
        if (!silent) playSound("/sounds/click.mp3", 0.35);
        onClick?.(e);
      }}
      {...props}
    />
  )
);
Button.displayName = "Button";
