# Portfolio — Apple-minimal + interactive passport (Trung Vo)

Context file for an AI agent picking up this repo. Read this first.

## What this is

A personal portfolio for **Trung Vo** (Product Designer at IBM, watsonx.data), built
on an **Apple-minimal** aesthetic that doubles as a small personal design system.
It has two signature interactions:

1. **Interactive passport** — a skeuomorphic booklet (right side of the hero,
   inspired by vercel.com/passport) that opens **inline** to reveal an identity
   page and rubber-stamp pages for schools & companies.
2. **Immersive case studies** — clicking a grid card morphs the whole card into a
   full case-study view (shared-element/`layoutId`), with prev/next navigation.

Design reference: `~/Downloads/DESIGN-apple.md` (full Apple token doc). Source
layout came from a Figma file (key `6C36nlJRgkxTxxpIN7r4n4`, node `2660:4802`):
centered glass pill nav, two-column hero (bio left, passport right), 2×2 case-study
grid below.

## Stack

- **Next.js 16** (App Router, React 19) + **TypeScript**, `src/` dir, `@/*` → `src/*`.
- **Tailwind v4** — tokens via `@theme inline` in `src/app/globals.css`; **no**
  `tailwind.config`.
- **Motion** (`motion` / framer-motion) for all animation (shared-layout morph,
  passport 3D, page transitions).
- **Geist** font via `geist/font` (`GeistSans`, `GeistMono`) + **Geist icons**
  vendored as SVG components in `src/components/ui/icons` (deliberate: user asked
  for Geist icons, overriding a "lucide only" convention; no icon dependency).
- Package manager **pnpm**.

## Run / preview

- Dev: `pnpm dev` (Next + Turbopack). Preview config lives in the HOME
  `~/.claude/launch.json` under the name `portfolio-apple` (port **3010**), not in
  the project.
- `sharp` must be built or `pnpm dev` fails a deps check — `pnpm-workspace.yaml`
  has `onlyBuiltDependencies: [sharp]`; run `pnpm rebuild sharp` if it complains.

## File map

```
src/
  app/
    layout.tsx          Geist fonts + <FloatingNav/> + metadata
    globals.css         design tokens (@theme inline + :root), motion tokens,
                        texts-reveal + stamp-press keyframes, GLOBAL SCROLLBAR HIDE
    page.tsx            <Intro/> + <CaseStudyGrid/>
  components/
    FloatingNav.tsx     glass pill nav (home/user/search), active state
    Intro.tsx           "Trung Vo" + bio (left) and <Passport/> (right), texts-reveal
    CaseStudyGrid.tsx   client; owns open/nav state; deep-link ?case=slug; renders cards + overlay
    CaseStudyCard.tsx   grid tile (motion.button) wrapping the shared face
    CaseStudyCardFace.tsx  SHARED face used by BOTH card and overlay hero (identical
                           markup = lag-free morph); parchment container + image box
    CaseStudyOverlay.tsx   full-viewport case-study view; hero = shared face; text slides on nav
    CaseStudyContent.tsx   long-form body (tag/title/blurb/role/year + sections)
    passport/
      Passport.tsx      SELF-CONTAINED interactive passport (inline, no portal)
      PassportCover.tsx cover face (matte black, multilingual wordmark, glyph)
      PassportPage.tsx  cream page shell (watermark + optional header + page no.)
      IdentityPage.tsx  photo/initials + identity fields + signature + MRZ strip
      StampsPage.tsx    header + grid of <Stamp/> (EDUCATION / EXPERIENCE)
      NotePage.tsx      closing personal note ("DECLARATION")
      Stamp.tsx         data-driven ink rubber stamp (SVG + feTurbulence texture)
    ui/
      Button.tsx        CVA pill/secondary/pearl/link primitives
      IconButton.tsx    CVA nav / glass / ghost icon chips
      icons/index.tsx   vendored Geist SVG icons (home,user,search,arrows,close)
  lib/
    utils.ts            cn() = clsx + tailwind-merge
    case-studies.ts     4 typed CaseStudy entries (PLACEHOLDER narratives)
    passport.ts         identity + education[] + experience[] stamp data
public/
  case-studies/img45..48.png   downscaled (<=1600px) case-study thumbnails/heroes
  passport/                     photo slot (currently none → initials placeholder)
```

## The two interactions (how they work)

### Interactive passport — `passport/Passport.tsx`
- Opens **inline**, NOT as an overlay/portal. A spacer div reserves the closed
  footprint (`aspect-[300/439]`) so opening never shifts layout; the open booklet
  is `position:absolute right-0` and grows leftward over the hero (Vercel-style).
- **The passport itself is the only control** (a `role="button"` div, NOT a
  `<button>`; no open/close buttons). Tap opens → tap turns the page → tap on the
  last page closes (Escape also closes). Hint text mirrors state
  (`TAP TO OPEN` / `TAP TO TURN →` / `TAP TO CLOSE`).
- **State is ONE object** `{ open, step }` advanced via a functional updater — do
  NOT split into separate `open`/`step` states (that caused a stale-closure bug
  where clicks over-advanced).
- Cover is a CSS-3D leaf that swings on the spine (`rotateY 0 → -180`, fades) to
  open, and swings back to close. Hover tilt (pointer-tracked `rotateX/rotateY`)
  applies only when closed.
- Responsive: desktop (`>=640px`) shows a 2-page spread; mobile shows one page and
  cycles through all four. `perView`/`pw` measured from the wrapper + a resize
  listener.
- Content is fully data-driven from `lib/passport.ts`.

### Case-study morph — `CaseStudyCard(Face)` + `CaseStudyGrid` + `CaseStudyOverlay`
- The **whole card face** is the shared element. `CaseStudyCardFace` is rendered
  IDENTICALLY in the grid card and the overlay hero (same DOM, percentage-based
  sizing) — this is what makes the morph lag-free. Do not diverge the two.
- `layoutId` = `card-${slug}` (container) + `card-img-${slug}` (image). In the
  overlay the anchor is pinned to the **opened** slug and stays put while paging;
  only the image swaps and the text content slides side-by-side.
- `CaseStudyGrid` owns state `{ index, dir, opened }`, deep-links via `?case=slug`
  (pushState/popstate), and syncs the URL in an effect **deferred with
  `setTimeout(…,0)`** — Next 16 App Router patches `history.pushState` and updates
  synchronously, which otherwise throws "setState during render".

## Design tokens (globals.css)

Surfaces `--canvas #fff`, `--parchment #f2f2f7`, `--tile-dark #272729`; text
`--ink #1d1d1f`, `--muted #727272`; single accent `--accent #0066cc`. Passport:
`--passport-cover #0a0a0a`, `--passport-page #f5f4f0`, stamp inks
purple/blue/red/green. Motion: `--ease-smooth cubic-bezier(0.22,1,0.36,1)` +
duration scale. Radius `--radius-card 24px`, `--radius-pill 9999px`.
**Scrollbars are hidden globally** (borderless scroll) — `scrollbar-width:none` +
`::-webkit-scrollbar{display:none}` on `html, body, *`.

Case-study card images are intentionally **flush**: no radius, no shadow (per
design direction). The "one product shadow" token still exists but is currently
unused on the cards.

## Conventions

- RSC by default; add `"use client"` only where needed (state/hooks/Motion).
- UI primitives use CVA + `forwardRef` + `cn()`; named exports (Next pages/layouts
  are the only default exports).
- Never hardcode hex where a token exists; use `next/image` for raster; keep the
  single-accent rule (`--accent`).
- Reduced motion: `useReducedMotion()` + CSS `@media (prefers-reduced-motion)`
  guards; keep both when adding animation.

## Known gotchas (learned the hard way)

- Overwriting `public/case-studies/*.png` while Next's image optimizer was mid-
  request **poisons the `.next` image cache** for those files (blank images). Fix:
  `rm -rf .next` and restart. Source PNGs were downscaled to ≤1600px so on-demand
  optimization is fast.
- `pnpm dev` deps check fails on unbuilt `sharp` — see Run section.
- Calling `history.pushState` inside a React effect warns under Next 16 unless
  deferred out of the commit (`setTimeout(…,0)`).

## TODO / placeholders (need real content from Trung)

- **Photo**: drop at `public/passport/photo.jpg` and set `identity.photo` in
  `lib/passport.ts` (currently `null` → shows "TV" initials).
- **Schools**: replace the placeholder `education[]` stamps (names + years).
- **Companies**: confirm `experience[]` (seeded IBM / Zeme / Suncoast + dates).
- **Case-study copy**: `lib/case-studies.ts` narratives are realistic placeholders.
- Not done this pass: real nav destinations beyond stubs; Vercel deploy.
