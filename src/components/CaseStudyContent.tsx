"use client";

import type { CaseStudy } from "@/lib/case-studies";

export function CaseStudyContent({ study }: { study: CaseStudy }) {
  return (
    <article className="mx-auto w-full max-w-[760px] px-6 pb-28">
      <header className="border-b border-hairline pb-8">
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
          {study.tag}
        </p>
        <h2 className="mt-3 text-[32px] font-semibold leading-[1.15] tracking-[-0.4px] text-ink">
          {study.title}
        </h2>
        <p className="mt-4 max-w-[620px] text-[16px] leading-[1.5] tracking-[-0.2px] text-muted-2">
          {study.blurb}
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
              Role
            </dt>
            <dd className="mt-1 text-[16px] text-ink">{study.role}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
              Year
            </dt>
            <dd className="mt-1 text-[16px] text-ink">{study.year}</dd>
          </div>
        </dl>
      </header>

      <div className="mt-12 flex flex-col gap-12">
        {study.sections.map((s) => (
          <section key={s.heading}>
            <h3 className="text-[24px] font-semibold tracking-[-0.4px] text-ink">
              {s.heading}
            </h3>
            <p className="mt-3 text-[16px] leading-[1.6] tracking-[-0.2px] text-ink/80">
              {s.body}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
