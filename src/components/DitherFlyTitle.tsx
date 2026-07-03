"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const TEXT = "We are in the Future";
const MOBILE_BREAKPOINT = 640; // below this, plain font — no dither, no hover physics
const RADIUS = 120; // px — how far from the cursor a character starts reacting
const MAX_DISPLACE = 36; // px — displacement at zero distance from the cursor

/**
 * The footer headline, dithered into the same dot texture as the
 * LivingDotMatrix field behind it (radial-gradient dot mask per glyph,
 * matching the site's ordered-dither language rather than solid fill).
 *
 * On desktop, hovering scatters nearby characters away from the cursor —
 * displacement falls off with distance (inverse-linear within RADIUS) and
 * eases back to rest on a CSS transition, so fast pointer movement doesn't
 * need per-frame JS animation. Positions are written directly via
 * `span.style.transform` (bypassing React state) so this stays smooth even
 * at high pointermove frequency.
 *
 * On mobile there's no meaningful hover, and shrinking the dither dots to
 * stay legible at small sizes isn't worth the complexity — plain solid text.
 */
export function DitherFlyTitle() {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reduce = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!mounted || mobile || reduce) return;
    const el = containerRef.current;
    if (!el) return;

    const settle = () => {
      for (const span of charRefs.current) {
        if (span) span.style.transform = "";
      }
    };

    const onMove = (e: PointerEvent) => {
      const mx = e.clientX;
      const my = e.clientY;
      for (const span of charRefs.current) {
        if (!span) continue;
        const r = span.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - mx;
        const dy = cy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < RADIUS) {
          const strength = 1 - dist / RADIUS;
          const nx = dist === 0 ? 1 : dx / dist;
          const ny = dist === 0 ? 0 : dy / dist;
          span.style.transform = `translate(${(nx * strength * MAX_DISPLACE).toFixed(1)}px, ${(ny * strength * MAX_DISPLACE).toFixed(1)}px)`;
        } else {
          span.style.transform = "";
        }
      }
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", settle);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", settle);
      settle();
    };
  }, [mounted, mobile, reduce]);

  const headingClass =
    "dither-title relative text-center text-[clamp(48px,8vw,96px)] font-medium leading-none tracking-[-0.04em] text-black";

  // SSR + mobile + reduced-motion all render the same plain markup — no
  // per-character split needed when there's no interaction to drive.
  if (!mounted || mobile || reduce) {
    return <h2 className={headingClass}>{TEXT}</h2>;
  }

  return (
    <h2
      ref={containerRef}
      aria-label={TEXT}
      className={`${headingClass} flex flex-wrap items-center justify-center`}
    >
      {TEXT.split("").map((ch, i) => (
        <span
          key={i}
          ref={(el) => {
            charRefs.current[i] = el;
          }}
          aria-hidden="true"
          className="dither-char inline-block will-change-transform"
          style={{ transition: "transform 320ms var(--ease-smooth)" }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </h2>
  );
}
