"use client";

/**
 * Fire-and-forget one-shot sound effect. Creates a fresh Audio instance per
 * call (rather than a shared/cached element) so rapid repeated triggers —
 * e.g. three stamps placed quickly — layer naturally instead of one
 * playback cutting the next one off. Always called from a user-gesture
 * handler (click/pointerdown), so autoplay restrictions don't apply.
 *
 * `startAt` skips leading silence/lead-in baked into the source file (e.g.
 * a page-turn sample that doesn't start "reading" until partway in). Set on
 * the element both immediately and again on `loadedmetadata`, since some
 * browsers ignore an early `currentTime` set before duration is known.
 */
export function playSound(src: string, volume = 0.55, startAt = 0) {
  if (typeof window === "undefined") return;
  const audio = new Audio(src);
  audio.volume = volume;
  if (startAt > 0) {
    audio.currentTime = startAt;
    audio.addEventListener(
      "loadedmetadata",
      () => {
        audio.currentTime = startAt;
      },
      { once: true }
    );
  }
  audio.play().catch(() => {
    // Ignore — e.g. a stray play() before any user gesture has landed yet.
  });
}
