"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CaseStudy } from "@/lib/case-studies";
import { CaseStudyCardFace } from "./CaseStudyCardFace";
import { playSound } from "@/lib/sound";

export function CaseStudyCard({
  study,
  onOpen,
}: {
  study: CaseStudy;
  onOpen: (slug: string) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={() => {
        playSound("/sounds/click.mp3", 0.35);
        onOpen(study.slug);
      }}
      aria-label={`Open case study: ${study.title}`}
      className="group aspect-[478/360] w-full rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <CaseStudyCardFace study={study} layoutSlug={study.slug} sizes="(max-width: 640px) 90vw, 460px" />
    </motion.button>
  );
}
