"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { CaseStudy } from "@/lib/case-studies";

/**
 * The shared visual "face" used by BOTH the grid card and the expanded overlay
 * hero. Keeping the markup identical (percentage-based so it scales uniformly)
 * is what makes the shared-element morph lag-free — Motion only has to scale one
 * consistent tree instead of reconciling two different ones.
 *
 * `layoutSlug` drives the layoutId (the morph anchor); `study` drives the image.
 * They differ only while paging prev/next in the overlay, where the anchor stays
 * pinned to the opened card but the image shown is the current study.
 */
const MORPH = { duration: 0.55, ease: [0.22, 1, 0.36, 1] } as const;

export function CaseStudyCardFace({
  study,
  layoutSlug,
  sizes = "300px",
  // Aspect-ratio-locked + percentage width, NOT a fixed pixel height — a
  // fixed height with only max-width clamped breaks the ratio the moment the
  // container gets narrower than the design width, which is what made the
  // overlay hero look "stretched" on anything but a wide viewport. Both the
  // grid card and the overlay hero use this same default so they're always
  // proportionally identical, just naturally bigger in the overlay.
  imageFrameClassName = "aspect-[3/2] w-[88%]",
}: {
  study: CaseStudy;
  layoutSlug: string;
  sizes?: string;
  imageFrameClassName?: string;
}) {
  return (
    <motion.div
      layoutId={`card-${layoutSlug}`}
      className="flex aspect-[478/360] w-full items-center justify-center rounded-card bg-parchment"
      transition={MORPH}
    >
      <motion.div
        layoutId={`card-img-${layoutSlug}`}
        className={`relative overflow-hidden ${imageFrameClassName}`}
        transition={MORPH}
      >
        <Image
          src={study.image}
          alt={study.title}
          fill
          sizes={sizes}
          className="object-contain object-center"
          priority
        />
      </motion.div>
    </motion.div>
  );
}
