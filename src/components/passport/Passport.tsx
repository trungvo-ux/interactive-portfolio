"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PassportCover } from "./PassportCover";
import { AboutMePage } from "./AboutMePage";
import { StampCanvasPage } from "./StampCanvasPage";
import { IconButton } from "@/components/ui/IconButton";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { playSound } from "@/lib/sound";
import { PALETTE_PASSPORT_OPEN } from "@/lib/palette-events";

const COVER_ASPECT = 439 / 300; // height / width
const BASE_W = 300; // internal layout width (kept crisp, then uniformly scaled)
const SCALE = 1.4; // desired render scale on roomy viewports; shrinks to fit narrower ones
const PAGE_GUTTER = 48; // matches the page's px-6 (24px) horizontal padding, both sides
const SINGLE_PAGE_BREAKPOINT = 640; // below this, show one page at a time instead of shrinking text

/**
 * Self-contained interactive passport. It lives inline in its parent (no portal,
 * no backdrop) and reserves its closed footprint so opening never shifts layout —
 * the open booklet grows leftward over its surroundings, like vercel.com/passport.
 *
 * Click the closed cover to open it; click anywhere outside the passport, or
 * press Escape, to close it. Once open, the spread stays fixed: the left page
 * is About Me, and the right page is a stamp canvas.
 *
 * Sizing: `outerScale` renders the closed cover at up to `SCALE` (140%) on
 * roomy viewports, shrinking to fit narrower ones so it never overflows the
 * page gutters. `fitScale` is an additional shrink applied only while open
 * (the spread is 2x as wide), computed relative to `outerScale` so the two
 * never compound into an overflow on mobile.
 *
 * Below `SINGLE_PAGE_BREAKPOINT`, showing both pages side by side would
 * shrink the identification/stamp text well under 14px to fit — instead the
 * book shows one page at a time (About Me, then Experience) with small
 * prev/next controls, matching the case-study overlay's nav pattern.
 */
export function Passport() {
  const reduce = useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [mobilePage, setMobilePage] = useState<0 | 1>(0);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [pw, setPw] = useState(300);
  const [vw, setVw] = useState(1024);

  useEffect(() => {
    const measure = () => {
      setPw(wrapRef.current?.offsetWidth ?? 300);
      setVw(window.innerWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const ph = Math.round(pw * COVER_ASPECT);
  const singlePage = vw < SINGLE_PAGE_BREAKPOINT;
  const bookWidth = open ? (singlePage ? pw : pw * 2) : pw;

  // Outer scale is the closed-cover render size — it defines the reserved
  // footprint, so it's computed from the CLOSED width only and never jumps
  // when opening. Shrinks below the desired SCALE on narrow viewports so the
  // closed cover itself never overflows the page gutters.
  const outerScale = Math.min(SCALE, (vw - PAGE_GUTTER) / BASE_W);

  // Fit scale is an additional shrink applied only when the two-page spread
  // is open on a viewport too narrow for it, relative to the outer scale
  // already in effect. Not needed in single-page mode — a lone page is only
  // as wide as the closed cover, which outerScale already fits.
  const fitScale = open && !singlePage
    ? Math.min(1, (vw - PAGE_GUTTER) / (pw * 2 * outerScale))
    : 1;

  // Reset to the first page whenever the book closes, so it always reopens
  // on Identification.
  useEffect(() => {
    if (!open) setMobilePage(0);
  }, [open]);

  useEffect(() => {
    const onOpen = () => {
      setOpen((current) => {
        if (!current) playSound("/sounds/turnpaper.mp3", 0.55, 0.3);
        return true;
      });
    };
    window.addEventListener(PALETTE_PASSPORT_OPEN, onOpen);
    return () => window.removeEventListener(PALETTE_PASSPORT_OPEN, onOpen);
  }, []);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || open) return;
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTilt({
      rx: -((e.clientY - r.top) / r.height - 0.5) * 12,
      ry: ((e.clientX - r.left) / r.width - 0.5) * 16,
    });
  };
  const reset = () => setTilt({ rx: 0, ry: 0 });

  const toggle = useCallback(() => {
    setOpen((current) => !current);
    playSound("/sounds/turnpaper.mp3", 0.55, 0.3);
  }, []);

  const turnMobilePage = useCallback((page: 0 | 1) => {
    setMobilePage((current) => {
      if (current !== page) playSound("/sounds/turnpaper.mp3", 0.4, 0.3);
      return page;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Click/tap outside the passport closes it.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (outerRef.current && !outerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div
      id="passport"
      ref={outerRef}
      className="relative mx-auto flex flex-col items-center"
    >
      <div
        className="relative flex justify-center"
        style={{
          width: BASE_W * outerScale,
          height: (open ? ph * fitScale : ph) * outerScale,
        }}
      >
        <div
          className="shrink-0"
          style={{
            width: BASE_W,
            transformOrigin: "top center",
            transform: `scale(${outerScale})`,
          }}
        >
          <div
            ref={wrapRef}
            className="relative w-full"
            style={{
              perspective: 1800,
              height: open ? ph * fitScale : ph,
            }}
          >
        {/* Reserve the closed footprint so opening doesn't shift the layout. */}
        <motion.div
          role={!open ? "button" : undefined}
          tabIndex={!open ? 0 : undefined}
          aria-expanded={open}
          aria-label={open ? "Trung Vo passport stamp spread" : "Open Trung Vo's passport"}
          onClick={!open ? toggle : undefined}
          onKeyDown={(e) => {
            if (!open && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              toggle();
            }
          }}
          onPointerMove={onMove}
          onPointerLeave={reset}
          className="absolute right-0 top-0 z-40 rounded-l-none rounded-r-[12px] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          style={{
            transformOrigin: "right top",
            transformStyle: "preserve-3d",
            height: ph,
          }}
          animate={{
            width: bookWidth,
            scale: fitScale,
            rotateX: open ? 0 : tilt.rx,
            rotateY: open ? (reduce ? 0 : -7) : tilt.ry,
            rotateZ: open && !reduce ? -1.2 : 0,
            y: !open && (tilt.rx || tilt.ry) ? -6 : 0,
            x: 0,
          }}
          transition={{
            width: { duration: 0.66, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
            x: { duration: 0.66, ease: [0.22, 1, 0.36, 1] },
            rotateX: { type: "spring", stiffness: 220, damping: 18 },
            rotateY: { type: "spring", stiffness: 180, damping: 19 },
            rotateZ: { type: "spring", stiffness: 180, damping: 22 },
            y: { type: "spring", stiffness: 220, damping: 18 },
          }}
        >
          <div
            className="relative h-full w-full overflow-visible rounded-l-none rounded-r-[12px]"
            style={{ filter: "drop-shadow(rgba(0,0,0,0.26) 2px 14px 32px)" }}
          >
            <div className="relative z-10 h-full w-full overflow-hidden rounded-l-none rounded-r-[12px]">
              {/* Pages, right-anchored so the closed width reveals only the cover.
                  In single-page mode the visible window is only `pw` wide, so
                  the track is nudged to bring page 0 (About Me) into view;
                  page 1 (stamps) is the default, right-aligned position. */}
              <motion.div
                className="absolute right-0 top-0 flex h-full"
                style={{ width: pw * 2 }}
                animate={{ x: singlePage && mobilePage === 0 ? pw : 0 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="t-panel-slide flex h-full w-full"
                  data-open={open}
                  style={{ ["--panel-translate-y" as string]: "18px" }}
                >
                  <div
                    style={{ width: pw }}
                    className="h-full border-r border-black/10"
                  >
                    <AboutMePage />
                  </div>
                  <div style={{ width: pw }} className="h-full">
                    <StampCanvasPage />
                  </div>
                </div>
              </motion.div>

              {/* Spine shadow between the two open pages. */}
              {open && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-0 z-20 h-full w-10"
                  style={{
                    right: pw - 20,
                    background:
                      "linear-gradient(to right, transparent, rgba(0,0,0,0.18), rgba(255,255,255,0.45), transparent)",
                  }}
                />
              )}

              {/* The cover: swings open on the spine, then stays as a dark left leaf. */}
              <motion.div
                aria-hidden
                className="absolute right-0 top-0 z-30 h-full origin-left"
                style={{
                  width: pw,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
                animate={
                  reduce
                    ? { opacity: open ? 0 : 1 }
                    : {
                        rotateY: open ? -158 : 0,
                        x: open ? -pw * 0.9 : 0,
                        opacity: 1,
                      }
                }
                transition={
                  reduce
                    ? { duration: 0.2 }
                    : {
                        rotateY: { duration: 0.74, ease: [0.22, 1, 0.36, 1] },
                        x: { duration: 0.74, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.2 },
                      }
                }
              >
                <PassportCover />
              </motion.div>
            </div>
          </div>
        </motion.div>
          </div>
        </div>
      </div>

      {/* Single-page mode only: small prev/next controls, mirroring the
          case-study overlay's nav pattern so the passport doesn't invent a
          new control shape. */}
      {open && singlePage && (
        <div className="mt-3 flex items-center gap-2">
          <IconButton
            variant="ghost"
            aria-label="Previous page"
            onClick={() => turnMobilePage(0)}
            disabled={mobilePage === 0}
            silent
            className="disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowLeftIcon size={16} />
          </IconButton>
          <span className="min-w-[40px] text-center font-mono text-[11px] text-muted">
            {mobilePage + 1} / 2
          </span>
          <IconButton
            variant="ghost"
            aria-label="Next page"
            onClick={() => turnMobilePage(1)}
            disabled={mobilePage === 1}
            silent
            className="disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowRightIcon size={16} />
          </IconButton>
        </div>
      )}
    </div>
  );
}
