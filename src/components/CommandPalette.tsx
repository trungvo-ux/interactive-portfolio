"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  buildCommands,
  filterCommands,
  groupCommands,
  type PaletteCommand,
} from "@/lib/command-palette";
import {
  dispatchOpenCase,
  dispatchPassportOpen,
  PALETTE_SEARCH_TAP,
} from "@/lib/palette-events";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

type UnlockMethod = "tv" | "search" | null;

const SEARCH_TAPS_NEEDED = 5;
const SEARCH_TAP_WINDOW_MS = 2500;
const TV_SEQUENCE = [".", "t", "v"] as const;

export function CommandPalette() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [unlockMethod, setUnlockMethod] = useState<UnlockMethod>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const tvIndexRef = useRef(0);
  const tvTimerRef = useRef<number | null>(null);
  const searchTapsRef = useRef<number[]>([]);

  const commands = useMemo(() => buildCommands(), []);
  const filtered = useMemo(
    () => filterCommands(commands, query),
    [commands, query]
  );
  const groups = useMemo(() => groupCommands(filtered), [filtered]);

  const flatFiltered = useMemo(
    () => groups.flatMap((group) => group.commands),
    [groups]
  );

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const pulseAccent = useCallback(() => {
    document.documentElement.classList.add("palette-accent-pulse");
    window.setTimeout(
      () => document.documentElement.classList.remove("palette-accent-pulse"),
      900
    );
  }, []);

  const actionContext = useMemo(
    () => ({
      openCase: (slug: string) => {
        dispatchOpenCase(slug);
        setOpen(false);
      },
      scrollToPassport: () => {
        document
          .getElementById("passport")
          ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      },
      openPassport: () => {
        dispatchPassportOpen();
        setOpen(false);
      },
      copy: async (text: string, message: string) => {
        try {
          await navigator.clipboard.writeText(text);
          showToast(message);
        } catch {
          showToast("Clipboard blocked — copy manually.");
        }
      },
      scrollTop: () => {
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        setOpen(false);
      },
      toast: showToast,
      stamp: () => {
        playSound("/sounds/stamp.mp3", 0.65);
        showToast("Stamp applied. (Ink is dry.)");
      },
      pulseAccent,
    }),
    [reduce, showToast, pulseAccent]
  );

  const reveal = useCallback((method: UnlockMethod) => {
    setUnlockMethod(method);
    setOpen(true);
    setQuery("");
    setActiveIndex(0);
    setToast(null);
    playSound("/sounds/click.mp3", 0.28);
    if (method === "search") playSound("/sounds/stamp.mp3", 0.45);
  }, []);

  const runCommand = useCallback(
    (cmd: PaletteCommand) => {
      playSound("/sounds/click.mp3", 0.32);
      cmd.run(actionContext);
    },
    [actionContext]
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-palette-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  // `.tv` unlock — terminal-style, nowhere advertised.
  useEffect(() => {
    const resetTv = () => {
      tvIndexRef.current = 0;
      if (tvTimerRef.current !== null) {
        window.clearTimeout(tvTimerRef.current);
        tvTimerRef.current = null;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (open) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = TV_SEQUENCE[tvIndexRef.current];

      if (key === expected) {
        tvIndexRef.current += 1;
        if (tvTimerRef.current !== null) window.clearTimeout(tvTimerRef.current);
        tvTimerRef.current = window.setTimeout(resetTv, 1400);

        if (tvIndexRef.current === TV_SEQUENCE.length) {
          resetTv();
          reveal("tv");
        }
        return;
      }

      if (key === TV_SEQUENCE[0]) {
        tvIndexRef.current = 1;
        if (tvTimerRef.current !== null) window.clearTimeout(tvTimerRef.current);
        tvTimerRef.current = window.setTimeout(resetTv, 1400);
        return;
      }

      resetTv();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      resetTv();
    };
  }, [open, reveal]);

  // Search icon × 5 unlock (dispatched from FloatingNav).
  useEffect(() => {
    const onSearchTap = () => {
      if (open) return;
      const now = Date.now();
      searchTapsRef.current = searchTapsRef.current.filter(
        (t) => now - t < SEARCH_TAP_WINDOW_MS
      );
      searchTapsRef.current.push(now);

      if (searchTapsRef.current.length >= SEARCH_TAPS_NEEDED) {
        searchTapsRef.current = [];
        reveal("search");
      }
    };

    window.addEventListener(PALETTE_SEARCH_TAP, onSearchTap);
    return () => window.removeEventListener(PALETTE_SEARCH_TAP, onSearchTap);
  }, [open, reveal]);

  const onPaletteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (flatFiltered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flatFiltered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flatFiltered.length) % flatFiltered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = flatFiltered[activeIndex];
      if (cmd) runCommand(cmd);
    }
  };

  if (!mounted) return null;

  let rowIndex = 0;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="palette"
          className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[min(18vh,120px)]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
          onKeyDown={onPaletteKeyDown}
        >
          <button
            type="button"
            aria-label="Close console"
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Hidden console"
            className="relative w-full max-w-[420px] overflow-hidden rounded-[20px] border border-black/[0.06] bg-[rgba(255,255,255,0.92)] shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl"
            initial={reduce ? false : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="border-b border-hairline px-4 py-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                {unlockMethod === "search"
                  ? "search × 5 — access granted"
                  : unlockMethod === "tv"
                    ? ".tv — welcome"
                    : "console"}
              </p>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="type a command…"
                aria-label="Command filter"
                autoComplete="off"
                spellCheck={false}
                className="mt-2 w-full bg-transparent text-[17px] tracking-[-0.48px] text-ink outline-none placeholder:text-muted-2"
              />
            </div>

            <div ref={listRef} className="max-h-[min(50vh,320px)] overflow-y-auto px-2 py-2">
              {flatFiltered.length === 0 ? (
                <p className="px-3 py-6 text-center text-[14px] text-muted">
                  No matches. Try &ldquo;passport&rdquo;, &ldquo;watsonx&rdquo;, or{" "}
                  <span className="font-mono text-[12px]">sudo hire trung</span>.
                </p>
              ) : (
                groups.map((group) => (
                  <div key={group.section} className="mb-1">
                    <p className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-2">
                      {group.label}
                    </p>
                    <ul>
                      {group.commands.map((cmd) => {
                        const index = rowIndex++;
                        const active = index === activeIndex;
                        return (
                          <li key={cmd.id}>
                            <button
                              type="button"
                              data-palette-index={index}
                              className={cn(
                                "flex w-full items-center justify-between gap-3 rounded-[12px] px-3 py-2.5 text-left transition-colors",
                                active ? "bg-accent text-white" : "text-ink hover:bg-black/[0.04]"
                              )}
                              onMouseEnter={() => setActiveIndex(index)}
                              onClick={() => runCommand(cmd)}
                            >
                              <span className="text-[15px] tracking-[-0.3px]">
                                {cmd.label}
                              </span>
                              {cmd.hint && (
                                <span
                                  className={cn(
                                    "truncate font-mono text-[10px] uppercase tracking-[0.12em]",
                                    active ? "text-white/75" : "text-muted-2"
                                  )}
                                >
                                  {cmd.hint}
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-hairline px-4 py-2.5">
              {toast ? (
                <p className="font-mono text-[11px] leading-relaxed tracking-[0.06em] text-accent">
                  {toast}
                </p>
              ) : (
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-2">
                  ↑↓ navigate · ↵ run · esc dismiss
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
