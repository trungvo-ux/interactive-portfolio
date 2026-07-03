import { identity } from "@/lib/passport";
import { LivingDotMatrix } from "./LivingDotMatrix";
import { DitherFlyTitle } from "./DitherFlyTitle";

function EmailIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M3.25 5.25h11.5v7.5H3.25z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path
        d="m3.75 5.75 5.25 4 5.25-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M4.1 7.2h2.15v6.25H4.1z" fill="currentColor" />
      <path d="M4 5.2a1.2 1.2 0 1 1 2.4 0 1.2 1.2 0 0 1-2.4 0" fill="currentColor" />
      <path
        d="M8.1 7.2h2.05v.85h.03c.3-.54 1.02-1.05 2.05-1.05 2.1 0 2.67 1.33 2.67 3.08v3.37h-2.15v-3.1c0-.76-.22-1.35-1.08-1.35-.88 0-1.42.6-1.42 1.55v2.9H8.1z"
        fill="currentColor"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M4 4h2.45l2.3 3.05L11.45 4h2.35l-3.9 4.38L14.25 14H11.8l-2.65-3.5L6.05 14H3.75l4.25-4.8z"
        fill="currentColor"
      />
    </svg>
  );
}

export function FooterDitherFlame() {
  return (
    <footer className="dither-footer relative flex min-h-[430px] w-full items-center justify-center overflow-hidden bg-canvas px-6 py-24">
      <LivingDotMatrix />
      <div className="relative z-10 flex flex-col items-center justify-center gap-[22px]">
        <DitherFlyTitle />
        <nav aria-label="Footer links" className="dither-socials flex items-center gap-2">
          <a href={`mailto:${identity.email}`} aria-label="Email Trung Vo">
            <EmailIcon />
          </a>
          <a
            href={identity.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
          >
            <XIcon />
          </a>
        </nav>
      </div>
    </footer>
  );
}
