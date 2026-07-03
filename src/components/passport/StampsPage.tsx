"use client";

import { type Stamp as StampData } from "@/lib/passport";
import { PassportPage } from "./PassportPage";
import { Stamp } from "./Stamp";

/** A page of rubber stamps — used for EDUCATION and EXPERIENCE. */
export function StampsPage({
  header,
  stamps,
  pageNumber,
  animate = true,
}: {
  header: string;
  stamps: StampData[];
  pageNumber?: number;
  animate?: boolean;
}) {
  return (
    <PassportPage header={header} pageNumber={pageNumber}>
      <div className="relative flex h-full flex-wrap content-around items-center justify-center gap-x-1 gap-y-0">
        <span
          aria-hidden
          className="absolute right-1 top-3 h-28 w-28 rounded-full border-[10px] border-[var(--stamp-blue)]/18"
        />
        {stamps.map((s, i) => (
          <Stamp key={s.label} stamp={s} index={i} animate={animate} />
        ))}
      </div>
    </PassportPage>
  );
}
