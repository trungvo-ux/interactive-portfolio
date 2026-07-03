"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import type { CaseStudy } from "@/lib/case-studies";
import { IconButton } from "@/components/ui/IconButton";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CloseIcon,
} from "@/components/ui/icons";
import { CaseStudyContent } from "./CaseStudyContent";
import { CaseStudyCardFace } from "./CaseStudyCardFace";

// transitions-dev 08 — page side-by-side tokens (see globals.css :root)
const PAGE_SLIDE_MS = 250;
const PAGE_SLIDE_S = PAGE_SLIDE_MS / 1000;
const PAGE_SLIDE_DIST = 8;
const PAGE_BLUR = 3;
const PAGE_EASE = [0.22, 1, 0.36, 1] as const;

export function CaseStudyOverlay({
  studies,
  index,
  dir,
  openedSlug,
  closeSignal,
  onClose,
  onNav,
}: {
  studies: CaseStudy[];
  index: number;
  dir: number;
  /** The card that was clicked — the stable morph anchor across prev/next. */
  openedSlug: string;
  /** Incremented by the grid when browser Back should use the animated close path. */
  closeSignal: number;
  onClose: () => void;
  onNav: (dir: 1 | -1) => void;
}) {
  const reduce = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const navBusyRef = useRef(false);
  const scrollAnimRef = useRef<ReturnType<typeof animate> | null>(null);
  const study = studies[index];
  // Two-phase close: content fades DOWN first, then we unmount (which triggers
  // the hero's layoutId morph back to the grid).
  const [closing, setClosing] = useState(false);
  const CONTENT_FADE = reduce ? 0 : 300; // ms

  const handleClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, CONTENT_FADE);
  }, [closing, onClose, CONTENT_FADE]);

  useEffect(() => {
    if (closeSignal > 0) handleClose();
  }, [closeSignal, handleClose]);

  // Nudge the hero left/right on prev/next so it slides in with the arrow
  // (the shared-element morph on open/close stays intact).
  const heroX = useMotionValue(0);
  useEffect(() => {
    if (dir === 0 || reduce) return;
    heroX.set(dir > 0 ? PAGE_SLIDE_DIST : -PAGE_SLIDE_DIST);
    const controls = animate(heroX, 0, {
      duration: PAGE_SLIDE_S,
      ease: PAGE_EASE,
    });
    return () => controls.stop();
  }, [index, dir, reduce, heroX]);

  // When scrolled down, animate scroll to top first, then fire nav so the slide
  // animation runs only after the overlay is back at the top.
  const handleNav = useCallback(
    (d: 1 | -1) => {
      if (navBusyRef.current) return;

      const el = scrollRef.current;
      if (!el) return;

      const scrolled = el.scrollTop > 1;

      if (!scrolled) {
        onNav(d);
        return;
      }

      navBusyRef.current = true;
      scrollAnimRef.current?.stop();

      if (reduce) {
        el.scrollTop = 0;
        onNav(d);
        navBusyRef.current = false;
        return;
      }

      const startScroll = el.scrollTop;
      scrollAnimRef.current = animate(startScroll, 0, {
        duration: PAGE_SLIDE_S,
        ease: PAGE_EASE,
        onUpdate: (v) => {
          el.scrollTop = v;
        },
        onComplete: () => {
          onNav(d);
          navBusyRef.current = false;
          scrollAnimRef.current = null;
        },
      });
    },
    [onNav, reduce]
  );

  useEffect(() => () => scrollAnimRef.current?.stop(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") handleNav(1);
      if (e.key === "ArrowLeft") handleNav(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [handleClose, handleNav]);

  return createPortal(
    // Root is a motion component (with no exit of its own) so AnimatePresence
    // keeps the subtree mounted while the nested scrim/chrome/content fade out
    // and the hero morphs back — the hero itself never fades.
    <motion.div
      ref={scrollRef}
      className="fixed inset-0 z-[100] overflow-y-auto"
      initial={false}
      role="dialog"
      aria-modal="true"
      aria-label={`${study.title} case study`}
    >
      {/* Background scrim — fades in on open, out on close. Kept separate from
          the hero so closing fades everything EXCEPT the morphing cover. */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0 bg-canvas"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* top control bar — fades out first, with the content, on close */}
      <motion.div
        className="sticky top-0 z-20 flex items-center justify-between px-5 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: closing ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* White-to-transparent scrim behind the controls, so content
            scrolling underneath fades out instead of cutting off hard. */}
        <div
          aria-hidden
          className="case-study-header-fade pointer-events-none absolute inset-x-0 top-0 -z-10 h-28"
        />
        <IconButton variant="ghost" aria-label="Close" onClick={handleClose}>
          <CloseIcon size={18} />
        </IconButton>
        <div className="flex items-center gap-2">
          <IconButton
            variant="ghost"
            aria-label="Previous case study"
            onClick={() => handleNav(-1)}
          >
            <ArrowLeftIcon size={18} />
          </IconButton>
          <span className="min-w-[52px] text-center font-mono text-[12px] text-muted">
            {index + 1} / {studies.length}
          </span>
          <IconButton
            variant="ghost"
            aria-label="Next case study"
            onClick={() => handleNav(1)}
          >
            <ArrowRightIcon size={18} />
          </IconButton>
        </div>
      </motion.div>

      {/* Hero — the opened card morphs into an identical, larger face and stays
          put. NOT wrapped in any fading layer, so on close it morphs back to the
          grid card while the scrim/chrome/content fade out around it. */}
      <motion.div
        className="relative z-10 mx-auto mb-10 w-full max-w-[1080px] px-6"
        style={{ x: heroX }}
      >
        <CaseStudyCardFace
          study={study}
          layoutSlug={openedSlug}
          sizes="(max-width: 1080px) 90vw, 950px"
        />
      </motion.div>

      {/* Body — on open, fades up from the bottom (delayed to land after the
          hero). On prev/next it slides left/right per the arrow. On close it
          fades DOWN first, before the cover morphs back. */}
      <AnimatePresence mode="wait" custom={{ dir, closing }}>
        <motion.section
          key={study.slug}
          className="relative z-10"
          custom={{ dir, closing }}
          variants={{
            initial: ({ dir }: { dir: number }) =>
              reduce
                ? { opacity: 0 }
                : dir === 0
                  ? { opacity: 0, y: 24 }
                  : {
                      opacity: 0,
                      x: dir > 0 ? PAGE_SLIDE_DIST : -PAGE_SLIDE_DIST,
                      filter: `blur(${PAGE_BLUR}px)`,
                    },
            animate: ({
              dir,
              closing,
            }: {
              dir: number;
              closing: boolean;
            }) =>
              closing
                ? {
                    opacity: 0,
                    y: reduce ? 0 : 28,
                    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
                  }
                : {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    filter: "blur(0px)",
                    transition:
                      dir === 0
                        ? {
                            duration: 0.45,
                            ease: PAGE_EASE,
                            delay: reduce ? 0 : 0.35,
                          }
                        : {
                            duration: PAGE_SLIDE_S,
                            ease: PAGE_EASE,
                          },
                  },
            exit: ({ dir }: { dir: number }) =>
              reduce
                ? { opacity: 0, transition: { duration: 0.15 } }
                : {
                    opacity: 0,
                    x: dir > 0 ? -PAGE_SLIDE_DIST : PAGE_SLIDE_DIST,
                    filter: `blur(${PAGE_BLUR}px)`,
                    transition: { duration: PAGE_SLIDE_S, ease: [0.4, 0, 1, 1] },
                  },
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ willChange: "transform, opacity, filter" }}
        >
          <CaseStudyContent study={study} />
        </motion.section>
      </AnimatePresence>
    </motion.div>,
    document.body
  );
}
