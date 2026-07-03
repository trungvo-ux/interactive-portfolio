"use client";

import { cn } from "@/lib/utils";

/** A single cream passport page: watermark, optional header, page number. */
export function PassportPage({
  header,
  pageNumber,
  children,
  className,
  watermark = true,
}: {
  header?: string;
  pageNumber?: number;
  children: React.ReactNode;
  className?: string;
  watermark?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden bg-[var(--passport-page)] px-7 py-7 shadow-[inset_0_-4px_0_rgba(29,29,31,0.72)]",
        watermark && "passport-watermark",
        className
      )}
      style={{ color: "var(--passport-ink)" }}
    >
      {header && (
        <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--passport-ink)]/55">
          {header}
        </p>
      )}
      <div className="relative flex-1">{children}</div>
      {pageNumber !== undefined && (
        <p className="mt-2 text-center font-mono text-[11px] text-[var(--passport-ink)]/45">
          {pageNumber}
        </p>
      )}
    </div>
  );
}
