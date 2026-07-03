# Product

## Register

brand

## Users
Design peers, recruiters, and hiring managers who land on the site to evaluate Trung Vo as a product designer. They're often scanning quickly on a phone (a link shared in Slack/LinkedIn/DMs), sometimes on desktop for a deeper look. They already know what a portfolio is for — they're judging craft, not reading a pitch.

## Product Purpose
A personal portfolio that doubles as a small personal design system, showcasing Trung's product design work (IBM watsonx.data, Pillar, Zeme, Expresso) alongside an interactive passport artifact that tells a more personal story (education, experience, identity). Success = a visitor leaves with a clear sense of Trung's craft and curiosity, on any device, without the site itself getting in the way.

## Brand Personality
Apple-minimal, quietly confident, restrained. One accent color (`--accent #0066cc`) carries every interactive signal — never a second brand color. Typography does the talking (Geist, tight tracking on display sizes). Playfulness is deliberately concentrated in one place — the interactive passport — rather than spread thin across the whole site. Photography-first where it counts (case-study screenshots), otherwise the UI recedes.

## Anti-references
- Generic SaaS-cream AI slop (warm off-white body bg "because portfolios feel warm")
- Gradient text, glassmorphism-as-decoration, side-stripe cards
- Tiny uppercase tracked eyebrows above every section, numbered section markers as default scaffolding
- Identical card grids with icon+heading+text repeated endlessly
- Anything that makes the case-study grid or passport feel like a generic dashboard rather than a crafted artifact

## Design Principles
- One accent color, no exceptions — restraint is the brand, not a constraint to work around
- The passport is the one place personality gets loud; everything else stays quiet so it doesn't compete
- Motion is intentional and reversible (shared-element morphs, not decorative animation) and always respects `prefers-reduced-motion`
- Mobile is not an afterthought — most visitors arrive from a shared link on a phone
- Practice what you preach: a product designer's portfolio should demonstrate the same craft discipline it claims

## Accessibility & Inclusion
- WCAG AA target: body text ≥4.5:1 contrast, large/bold text ≥3:1
- `prefers-reduced-motion` alternatives already implemented across the passport and case-study transitions (crossfade/instant instead of morphs, tilts, and shakes) — must be preserved through this mobile pass
- Touch targets should meet the ~44×44px minimum on mobile, including nav icons and passport paging controls
