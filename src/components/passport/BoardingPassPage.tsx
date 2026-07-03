"use client";

import { boardingPass, identity } from "@/lib/passport";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="font-mono text-[10px] leading-none text-black/35">{label}</p>
      <p className="mt-2 truncate font-mono text-[14px] font-semibold leading-none text-[var(--passport-ink)]">
        {value}
      </p>
    </div>
  );
}

function Barcode({ value }: { value: string }) {
  return (
    <div
      aria-hidden
      className="mt-auto flex h-[42px] w-full items-end gap-[2px] overflow-hidden border-t border-black/10 pt-3"
    >
      {value.split("").map((bit, i) => (
        <span
          key={`${bit}-${i}`}
          className="block bg-[var(--passport-ink)]"
          style={{
            width: bit === "1" ? 4 : 2,
            height: bit === "1" ? 34 : 26,
            opacity: bit === "1" ? 0.95 : 0.48,
          }}
        />
      ))}
    </div>
  );
}

export function BoardingPassPage({ pageNumber }: { pageNumber?: number }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--passport-cover)] p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-[22%]"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)",
        }}
      />

      <div className="relative flex h-full rotate-[-4deg] flex-col overflow-hidden rounded-[5px] border border-black/15 bg-white p-4 shadow-[0_18px_38px_-24px_rgba(0,0,0,0.65)]">
        <div className="-mx-4 -mt-4 mb-5 flex items-center justify-between bg-[var(--passport-cover-2)] px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-0 w-0"
              style={{
                borderLeft: "7px solid transparent",
                borderRight: "7px solid transparent",
                borderBottom: "12px solid rgba(255,255,255,0.95)",
              }}
            />
            <span className="font-mono text-[13px] font-semibold">
              {boardingPass.carrier}
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
            {identity.passportNo}
          </span>
        </div>

        <div className="flex items-end justify-between border-b border-dashed border-black/15 pb-5">
          <p className="font-mono text-[40px] leading-none tracking-[-0.08em] text-[var(--passport-ink)]">
            {boardingPass.from}
          </p>
          <p className="pb-1 font-mono text-[22px] leading-none text-black/22">
            {"->"}
          </p>
          <p className="font-mono text-[40px] leading-none tracking-[-0.08em] text-[var(--passport-ink)]">
            {boardingPass.to}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-[1.25fr_0.75fr] gap-x-5 gap-y-4">
          <Detail label="Passenger" value={identity.name} />
          <Detail label="Gate" value={boardingPass.gate} />
          <Detail label="Role" value={identity.title} />
          <Detail label="Seat" value={boardingPass.seat} />
          <Detail label="Flight" value={boardingPass.flight} />
          <Detail label="Depart" value={boardingPass.depart} />
          <Detail label="Board" value={boardingPass.board} />
          <Detail label="Issued" value={identity.issuedBy} />
        </div>

        <Barcode value={boardingPass.barcode} />

        {pageNumber !== undefined && (
          <p className="absolute bottom-2 right-3 font-mono text-[9px] text-black/28">
            {pageNumber}
          </p>
        )}
      </div>
    </div>
  );
}
