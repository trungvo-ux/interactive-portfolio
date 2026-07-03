"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient noise-driven dot matrix, inspired by high-end data-viz interfaces
 * (Terafab and similar). A grid of tiny ink-colored squares whose brightness
 * (opacity) is continuously modulated by layered FBM noise — never a hard
 * on/off flicker, never a repeating loop. Canvas 2D, no external deps: at
 * footer scale (a few thousand cells) this stays comfortably at 60fps
 * without the bundle cost of WebGL/R3F/PixiJS.
 *
 * Spatial coherence in the noise field is what produces the "nearby dots
 * brighten shortly after" propagation effect described in the brief — no
 * separate diffusion pass needed, the noise samples are already correlated
 * across neighboring cells.
 */

const CELL = 15; // px between dot centers (CSS px, pre-DPR)
const DOT = 1.9; // px, square dot size at brightness 1
const INK = "29, 29, 31"; // matches --ink, as an rgb() triple for template use
const GLOW_THRESHOLD = 0.5; // only the brightest cells get the extra bloom pass
const GAMMA = 1.6; // pushes most cells toward the low end; only peaks reach ~1

// ---- Random "shine" sparkles — independent of the ambient wave field ----
// A sparse, randomly-timed set of dots flash from 0 to 100% opacity and back
// down on a short, smooth envelope (never an instant on/off), so the field
// reads as quietly glinting rather than just breathing.
const SPARKLE_SPAWN_CHANCE = 0.45; // probability per frame of spawning a new sparkle
const SPARKLE_MIN_MS = 260;
const SPARKLE_MAX_MS = 650;
const MAX_ACTIVE_SPARKLES = 40;

type Sparkle = { start: number; duration: number };

// ---- Minimal seeded 2D value noise + FBM (no dependency) ----------------
function hash2(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}
function valueNoise2D(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = smoothstep(x - xi);
  const yf = smoothstep(y - yi);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}
function fbm(x: number, y: number, octaves: number): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += valueNoise2D(x * freq, y * freq) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm; // 0..1
}

/** One evaluation of the layered wave field at grid coords (col,row), time t (s). */
function sampleField(col: number, row: number, t: number): number {
  // Base FBM: 3 octaves, slow diagonal large-scale drift baked into the sample coords.
  const driftX = t * 0.035;
  const driftY = t * 0.02;
  const base = fbm(col * 0.05 + driftX, row * 0.05 + driftY, 3);

  // Very slow horizontal drift layer, independent frequency so it never
  // stays in phase with the base field.
  const horiz = fbm(col * 0.09 + t * 0.07, row * 0.02, 2);

  // Slight vertical flow.
  const vert = fbm(col * 0.015, row * 0.11 - t * 0.05, 2);

  let v = base * 0.55 + horiz * 0.25 + vert * 0.2;

  // Occasional circular ripple: a slow envelope decides when a ripple is
  // "active" so it reads as an occasional event, not a constant pulse.
  const rippleEnvelope = Math.max(0, Math.sin(t * 0.06 + col * 0.001) - 0.55) / 0.45;
  if (rippleEnvelope > 0) {
    const cx = 0.5 + 0.3 * Math.sin(t * 0.017);
    const cy = 0.5 + 0.3 * Math.cos(t * 0.013);
    const dx = col - cx * 200;
    const dy = row - cy * 60;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ripple = Math.sin(dist * 0.35 - t * 1.4) * Math.exp(-dist * 0.02);
    v += ripple * 0.18 * rippleEnvelope;
  }

  return Math.min(1, Math.max(0, v));
}

export function LivingDotMatrix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let cols = 0;
    let rows = 0;
    let dpr = 1;
    let raf = 0;
    let start = performance.now();
    let paused = false;
    const sparkles = new Map<string, Sparkle>();

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
    };

    const draw = (tSeconds: number, tMs: number) => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      // Spawn new random sparkles (skipped entirely under reduced motion,
      // since draw(0) there only ever runs once).
      if (
        !reduceMotion &&
        sparkles.size < MAX_ACTIVE_SPARKLES &&
        Math.random() < SPARKLE_SPAWN_CHANCE &&
        cols > 0 &&
        rows > 0
      ) {
        const col = Math.floor(Math.random() * cols);
        const row = Math.floor(Math.random() * rows);
        const key = `${col},${row}`;
        if (!sparkles.has(key)) {
          sparkles.set(key, {
            start: tMs,
            duration: SPARKLE_MIN_MS + Math.random() * (SPARKLE_MAX_MS - SPARKLE_MIN_MS),
          });
        }
      }

      const bright: { x: number; y: number; size: number; a: number }[] = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const n = sampleField(col, row, tSeconds);
          let brightness = Math.pow(n, GAMMA);

          // Random shine: a full 0→1→0 pulse layered on top of the ambient
          // field, smooth (sine envelope) rather than an instant flash.
          const key = `${col},${row}`;
          const sparkle = sparkles.get(key);
          if (sparkle) {
            const p = (tMs - sparkle.start) / sparkle.duration;
            if (p >= 1) {
              sparkles.delete(key);
            } else {
              const envelope = Math.sin(Math.min(1, Math.max(0, p)) * Math.PI);
              brightness = Math.max(brightness, envelope);
            }
          }

          const opacity = Math.min(1, (0.05 + brightness * 0.95) * 1.1);
          const size = DOT * (0.6 + brightness * 0.7);
          const x = col * CELL;
          const y = row * CELL;

          ctx.fillStyle = `rgba(${INK}, ${opacity.toFixed(3)})`;
          ctx.fillRect(x - size / 2, y - size / 2, size, size);

          if (brightness > GLOW_THRESHOLD) {
            bright.push({ x, y, size, a: opacity });
          }
        }
      }

      // Second pass: additive-feeling glow only on the brightest cells,
      // proportional to their brightness — not applied uniformly.
      if (bright.length) {
        ctx.save();
        ctx.shadowColor = `rgba(${INK}, 0.5)`;
        for (const d of bright) {
          ctx.shadowBlur = 6 * d.a;
          ctx.fillStyle = `rgba(${INK}, ${(d.a * 0.8).toFixed(3)})`;
          ctx.fillRect(d.x - d.size / 2, d.y - d.size / 2, d.size, d.size);
        }
        ctx.restore();
      }
    };

    const loop = (now: number) => {
      if (paused) return;
      const elapsed = now - start;
      draw(elapsed / 1000, elapsed);
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(0, 0);
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    resize();

    const onVisibility = () => {
      paused = document.hidden;
      if (!paused && !reduceMotion) {
        start = performance.now();
        raf = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    if (reduceMotion) {
      // Single calm static frame — no rAF loop at all.
      draw(0, 0);
    } else {
      document.addEventListener("visibilitychange", onVisibility);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%), radial-gradient(80% 85% at 50% 50%, black 0%, transparent 78%)",
        maskComposite: "intersect",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%), radial-gradient(80% 85% at 50% 50%, black 0%, transparent 78%)",
      }}
    />
  );
}
