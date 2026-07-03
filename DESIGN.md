---
name: Trung Vo Portfolio
description: Apple-minimal designer portfolio with an interactive passport centerpiece
colors:
  canvas: "#ffffff"
  parchment: "#f2f2f7"
  tile-dark: "#272729"
  black: "#000000"
  ink: "#1d1d1f"
  muted: "#727272"
  muted-2: "#7a7a7a"
  accent: "#0066cc"
  accent-on-dark: "#2997ff"
  hairline: "#e0e0e0"
  passport-cover: "#08006d"
  passport-cover-2: "#16161a"
  passport-page: "#f5f4f0"
  passport-ink: "#2a2a2c"
  stamp-purple: "#7a4d6b"
  stamp-blue: "#3a5a9a"
  stamp-red: "#9a3b3b"
  stamp-green: "#3b6b52"
typography:
  hero:
    fontFamily: "Geist Sans, system-ui, -apple-system, sans-serif"
    fontSize: "36px"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-1.08px"
  body:
    fontFamily: "Geist Sans, system-ui, -apple-system, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.48px"
  case-study-title:
    fontFamily: "Geist Sans, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(34px, 5vw, 56px)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-1.2px"
  mono-meta:
    fontFamily: "Geist Mono, monospace"
    fontSize: "11-12px"
    fontWeight: 400
    letterSpacing: "0.15-0.25em"
rounded:
  card: "24px"
  pill: "9999px"
  passport-cover: "10px"
spacing:
  section-gap: "93px"
  card-gap: "24px"
  card-pad: "10px"
components:
  nav-glass:
    backgroundColor: "rgba(116,116,128,0.08)"
    rounded: "{rounded.pill}"
  case-study-card:
    backgroundColor: "{colors.parchment}"
    rounded: "{rounded.card}"
  passport-cover:
    backgroundColor: "{colors.passport-cover}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.passport-cover}"
  passport-page:
    backgroundColor: "{colors.passport-page}"
    textColor: "{colors.passport-ink}"
---

## Overview

An Apple-minimal personal portfolio (Next.js 16 App Router, Tailwind v4, Motion) built around two ideas: a photography-first case-study grid that stays quiet, and one loud, playful centerpiece — an interactive passport (skeuomorphic booklet, CSS 3D, shared-element morph) that carries the site's personality. Everything else — nav, type, spacing — recedes so the accent and the passport can speak.

## Colors

Single accent (`--accent #0066cc`) carries every interactive element site-wide — never a second brand color. Surfaces alternate white canvas and a very light parchment (`#f2f2f7`) for card backgrounds. The passport introduces its own self-contained palette (deep navy cover, cream pages, four muted stamp inks) that never leaks into the rest of the site.

## Typography

Geist Sans for all display and body text; Geist Mono for meta labels (nav hints, passport page headers, case-study tags, timestamps) — the mono/sans split is the system's one recurring signal that "this is metadata, not content." Display sizes use tight negative tracking (down to -1.2px at the case-study title). Body copy stays legible at 16-17px, never below.

## Elevation

Exactly one shadow token (`--product-shadow`) used only under resting product imagery. The passport cover uses a soft `drop-shadow` to read as a physical object; passport pages use an `inset` shadow at the page foot instead of a drop shadow, to feel bound rather than floating. No shadows on buttons, nav, or generic cards.

## Components

- **Floating nav** — glass pill (`rgba(116,116,128,0.08)`, backdrop-blur), 3 icon buttons, centered top, fixed position.
- **Case-study card / hero** — `CaseStudyCardFace` is shared verbatim between the grid card and the expanded overlay hero so the `layoutId` morph interpolates one consistent tree (this is load-bearing for the morph feeling lag-free — do not fork the two).
- **Passport** — self-contained, inline (no portal/overlay), reserves its closed footprint so opening never shifts layout. Closed state hover-tilts in 3D; opens by growing rightward-anchored width plus a cover-swing. Currently sized at 1.4× via `SCALE` in `Passport.tsx` and fixed at `BASE_W = 300` internal layout width — this is the piece most likely to need mobile-specific rework (see Do's and Don'ts).
- **Buttons/IconButtons** — CVA variants (`ui/Button.tsx`, `ui/IconButton.tsx`), pill or ghost, `active:scale-95` as the universal press feedback.

## Do's and Don'ts

- Do keep the single-accent rule; never add a second brand color even for mobile-only affordances.
- Do preserve `prefers-reduced-motion` handling on every animated piece (passport tilt/swing, case-study morph, panel-reveal, texts-reveal) when adapting for mobile.
- Do keep `CaseStudyCardFace` shared between card and overlay — mobile layout changes must apply to both call sites identically or the morph breaks.
- Don't reintroduce the passport's "Open" button that was intentionally removed — the passport itself is the only control (tap to open, tap outside/Escape to close).
- Don't fork Passport.tsx into separate desktop/mobile components; adapt the existing `pw`/`vw`/`SCALE`/`spreadScale` sizing math instead, since it already has a responsive branch for narrow viewports.
- Don't add a second shadow style; the system intentionally has exactly one (plus the passport's page-foot inset).
