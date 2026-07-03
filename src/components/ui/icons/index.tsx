/**
 * Vendored Geist icons (Vercel's Geist design system).
 * 16px grid, 1.5 stroke, currentColor — matches Geist's icon spec so we
 * get the real Geist look without an extra icon dependency.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 16, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2.5 6.5 8 2l5.5 4.5" />
      <path d="M3.75 7.5V13a.5.5 0 0 0 .5.5h7.5a.5.5 0 0 0 .5-.5V7.5" />
      <path d="M6.5 13.5v-3.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v3.25" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="8" cy="5.25" r="2.5" />
      <path d="M2.75 13.25a5.25 5.25 0 0 1 10.5 0" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="7" cy="7" r="4.25" />
      <path d="m13.25 13.25-2.9-2.9" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12.5 8H3.5" />
      <path d="M7 3.5 2.5 8 7 12.5" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 8h9" />
      <path d="M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m4 4 8 8" />
      <path d="m12 4-8 8" />
    </svg>
  );
}
