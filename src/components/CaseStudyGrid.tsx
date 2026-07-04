"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { caseStudies } from "@/lib/case-studies";
import { PALETTE_OPEN_CASE } from "@/lib/palette-events";
import { CaseStudyCard } from "./CaseStudyCard";
import { CaseStudyOverlay } from "./CaseStudyOverlay";

// `opened` is the slug of the card that was clicked — it stays fixed while the
// user pages prev/next, so the shared-element morph always returns to it.
type View = { index: number | null; dir: number; opened: string | null };

export function CaseStudyGrid() {
  const [view, setView] = useState<View>({
    index: null,
    dir: 0,
    opened: null,
  });
  const [closeSignal, setCloseSignal] = useState(0);

  const setBySlug = useCallback((slug: string, dir = 0) => {
    const i = caseStudies.findIndex((c) => c.slug === slug);
    if (i >= 0) setView({ index: i, dir, opened: slug });
  }, []);

  // Deep-link on load + browser back/forward. This only reads the URL and
  // syncs state — it never writes, so it can't fight the explicit writes
  // below (which is what previously caused prev/next to pile up history
  // entries and snap back to the first case study on a back-swipe).
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("case");
    if (slug) setBySlug(slug);

    const onPop = () => {
      const p = new URLSearchParams(window.location.search).get("case");
      if (p) setBySlug(p);
      else {
        setView((current) => {
          if (current.index !== null) {
            setCloseSignal((signal) => signal + 1);
            return current;
          }
          return { index: null, dir: 0, opened: null };
        });
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [setBySlug]);

  // Opening a card is a real navigation — push a new history entry so back
  // returns to the grid.
  const open = useCallback((slug: string) => {
    setBySlug(slug, 0);
    window.setTimeout(() => {
      window.history.pushState({ case: slug }, "", `?case=${slug}`);
    }, 0);
  }, [setBySlug]);

  useEffect(() => {
    const onPaletteOpen = (e: Event) => {
      const slug = (e as CustomEvent<{ slug: string }>).detail?.slug;
      if (slug) open(slug);
    };
    window.addEventListener(PALETTE_OPEN_CASE, onPaletteOpen);
    return () => window.removeEventListener(PALETTE_OPEN_CASE, onPaletteOpen);
  }, [open]);

  const close = () => {
    setView({ index: null, dir: 0, opened: null });
    window.setTimeout(() => {
      if (new URLSearchParams(window.location.search).get("case")) {
        window.history.pushState({}, "", window.location.pathname);
      }
    }, 0);
  };

  // Paging prev/next stays within the same "session" — replace the URL
  // instead of pushing, so it doesn't grow the history stack. Pushing here
  // was the bug: a stack of ?case=A, ?case=B, ?case=C entries meant any
  // browser back gesture (trackpad swipe, mouse back button) would walk
  // back through past case studies instead of leaving the overlay.
  const nav = useCallback((d: 1 | -1) => {
    setView((v) => {
      if (v.index === null) return v;
      const nextIndex = (v.index + d + caseStudies.length) % caseStudies.length;
      const slug = caseStudies[nextIndex].slug;
      window.setTimeout(() => {
        window.history.replaceState({ case: slug }, "", `?case=${slug}`);
      }, 0);
      return { ...v, index: nextIndex, dir: d };
    });
  }, []);

  return (
    <>
      <section className="grid w-full grid-cols-1 gap-[24px] sm:grid-cols-2">
        {caseStudies.map((study) => (
          <CaseStudyCard key={study.slug} study={study} onOpen={open} />
        ))}
      </section>

      <AnimatePresence>
        {view.index !== null && (
          <CaseStudyOverlay
            studies={caseStudies}
            index={view.index}
            dir={view.dir}
            openedSlug={view.opened ?? caseStudies[view.index].slug}
            closeSignal={closeSignal}
            onClose={close}
            onNav={nav}
          />
        )}
      </AnimatePresence>
    </>
  );
}
