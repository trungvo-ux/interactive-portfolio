/** Custom events the hidden command palette uses to talk to the page. */

export const PALETTE_OPEN_CASE = "palette:open-case";
export const PALETTE_PASSPORT_OPEN = "palette:passport-open";
export const PALETTE_SEARCH_TAP = "palette:search-tap";

export function dispatchOpenCase(slug: string) {
  window.dispatchEvent(
    new CustomEvent(PALETTE_OPEN_CASE, { detail: { slug } })
  );
}

export function dispatchPassportOpen() {
  window.dispatchEvent(new CustomEvent(PALETTE_PASSPORT_OPEN));
}

export function dispatchSearchTap() {
  window.dispatchEvent(new CustomEvent(PALETTE_SEARCH_TAP));
}
