"use client";

import Image from "next/image";
import { identity } from "@/lib/passport";
import { PassportPage } from "./PassportPage";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--passport-ink)]/45">
        {label}
      </p>
      <p className="font-mono text-[13px] font-medium text-[var(--passport-ink)]">
        {value}
      </p>
    </div>
  );
}

export function IdentityPage({ pageNumber }: { pageNumber?: number }) {
  const initials = identity.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <PassportPage header="IDENTIFICATION" pageNumber={pageNumber}>
      <div className="flex h-full flex-col">
        <div className="flex gap-4">
          {/* Photo */}
          <div className="relative h-[104px] w-[82px] shrink-0 overflow-hidden rounded-[3px] border border-[var(--passport-ink)]/15 bg-[var(--passport-ink)]/5">
            {identity.photo ? (
              <Image
                src={identity.photo}
                alt={identity.name}
                fill
                className="object-cover grayscale-[0.15]"
                sizes="82px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-mono text-2xl font-semibold text-[var(--passport-ink)]/40">
                {initials}
              </div>
            )}
          </div>

          {/* Primary fields */}
          <div className="flex flex-1 flex-col justify-between py-0.5">
            <Field label="Surname / Given name" value={identity.name} />
            <Field label="Title" value={identity.title} />
            <Field label="Nationality" value={identity.nationality} />
            <Field label="Issued by" value={identity.issuedBy} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Field label="Passport no." value={identity.passportNo} />
          <Field label="Issued" value={identity.issued} />
          <Field label="Expires" value={identity.expires} />
        </div>

        <div className="mt-auto border-t border-dashed border-[var(--passport-ink)]/20 pt-3">
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--passport-ink)]/45">
            Signature
          </p>
          <p
            className="text-[22px] text-[var(--passport-ink)]/80"
            style={{ fontFamily: "var(--font-geist-sans)", fontStyle: "italic" }}
          >
            {identity.signature}
          </p>
        </div>

        {/* MRZ machine-readable strip */}
        <div className="mt-3 overflow-hidden font-mono text-[9px] leading-[1.35] tracking-[0.12em] text-[var(--passport-ink)]/55">
          <p className="truncate">P&lt;DSGNVO&lt;&lt;TRUNG&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</p>
          <p className="truncate">TV0001DSGN2IBM2026&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;04</p>
        </div>
      </div>
    </PassportPage>
  );
}
