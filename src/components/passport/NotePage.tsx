"use client";

import { PassportPage } from "./PassportPage";

/** A closing, personal page — the "why" behind the work. */
export function NotePage({ pageNumber }: { pageNumber?: number }) {
  return (
    <PassportPage header="DECLARATION" pageNumber={pageNumber}>
      <div className="flex h-full flex-col justify-center gap-4">
        <p
          className="text-[19px] leading-[1.4] tracking-[-0.3px] text-[var(--passport-ink)]"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          I design systems for complex data work — the kind that only earns trust
          when it disappears.
        </p>
        <p className="font-mono text-[11px] leading-[1.7] text-[var(--passport-ink)]/70">
          Currently at IBM on watsonx.data. Curious about how AI can enhance
          humanity, and stubborn about building the safeguards that let it.
        </p>
        <div className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--passport-ink)]/45">
          <span className="inline-block h-2 w-2 rotate-45 border border-[var(--passport-ink)]/40" />
          <span>Admit one · curiosity required</span>
        </div>
      </div>
    </PassportPage>
  );
}
