"use client";

import Image from "next/image";
import { identity } from "@/lib/passport";

/** Small label + value row (Figma node 2680:5116). */
function Field({
  label,
  value,
  valuePx = 12,
}: {
  label: string;
  value: string;
  valuePx?: number;
}) {
  return (
    <div className="flex w-full flex-col">
      <p className="font-mono text-[6px] uppercase tracking-[-0.18px] text-[#727272]">
        {label}
      </p>
      <p
        className="font-sans font-semibold tracking-[-0.36px] text-[#121212]"
        style={{ fontSize: valuePx }}
      >
        {value}
      </p>
    </div>
  );
}

export function AboutMePage() {
  return (
    <div className="relative flex h-full w-full flex-col gap-4 overflow-hidden bg-[#f9f9f9] px-4 pb-4 pt-6 text-[#121212]">
      {/* header + identity row */}
      <div className="flex w-full flex-col gap-2.5">
        <p className="font-mono text-[10px] tracking-[-0.3px] text-[#121212]">
          IDENTIFICATION
        </p>
        <div className="flex w-full items-stretch gap-3">
          <div className="relative w-[99px] shrink-0 self-stretch overflow-hidden bg-[#d8d8d8]">
            <Image
              src={identity.photo ?? "/passport/identity.png"}
              alt={identity.name}
              fill
              sizes="99px"
              className="object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Field label="FULL NAME" value={identity.name} valuePx={10} />
            <Field
              label="UNIVERSITY"
              value={identity.university}
              valuePx={10}
            />
            <Field label="LOCATION" value={identity.location} valuePx={10} />
            <Field
              label="CURRENT ROLE"
              value={identity.currentRole}
              valuePx={10}
            />
            <Field label="EXPIRES" value={identity.expires} valuePx={10} />
          </div>
        </div>
      </div>

      {/* description + action items */}
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="flex w-full flex-col gap-1">
          <p className="font-mono text-[6px] uppercase tracking-[-0.18px] text-[#727272]">
            DESCRIPTION
          </p>
          <div className="flex flex-col gap-2 font-sans text-[10px] tracking-[-0.3px] text-[#121212]">
            {identity.description.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col">
          <p className="font-mono text-[6px] uppercase tracking-[-0.18px] text-[#727272]">
            ACTION ITEMS
          </p>
          <div className="flex flex-col gap-2 font-sans text-[10px] tracking-[-0.3px] text-[#121212]">
            <a
              href={identity.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit underline decoration-solid underline-offset-2 hover:text-accent"
            >
              Linkedin
            </a>
            <a
              href={`mailto:${identity.email}`}
              className="w-fit underline decoration-solid underline-offset-2 hover:text-accent"
            >
              Email
            </a>
          </div>
        </div>
      </div>

      {/* machine-readable strip */}
      <p className="w-full break-all font-mono text-[10px] tracking-[-0.3px] text-[#121212]">
        {identity.mrz}
      </p>
    </div>
  );
}
