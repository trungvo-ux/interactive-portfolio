"use client";

import { identity } from "@/lib/passport";
import { cn } from "@/lib/utils";

/**
 * Passport cover (Figma node 2674:4822): deep navy, left-aligned multilingual
 * wordmark, "ISSUED 2026" top-right, "TRUNG VO" bottom-left. Used closed on the
 * page and as the swinging cover leaf when the passport opens.
 */
export function PassportCover({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col justify-between overflow-hidden rounded-l-none rounded-r-[12px] px-4 py-6 text-white",
        className
      )}
      style={{
        background:
          "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.06), transparent 55%), #08006d",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -5px 0 rgba(255,255,255,0.14)",
      }}
    >
      {/* top row: multilingual wordmark (left) + issued (right) */}
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex flex-col font-sans text-[20px] font-medium leading-[1.15] tracking-[-0.6px] text-white">
          <span>Passport</span>
          <span>Hộ chiếu</span>
          <span>パスポート</span>
        </div>
        <span className="whitespace-nowrap font-mono text-[10px] tracking-[-0.3px] text-white/80">
          ISSUED 2026
        </span>
      </div>

      {/* bottom: holder name */}
      <span className="font-mono text-[10px] uppercase tracking-[-0.3px] text-white/80">
        {identity.name}
      </span>
    </div>
  );
}
