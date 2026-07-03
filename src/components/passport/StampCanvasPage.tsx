"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { stampBrands, type StampBrand } from "@/lib/passport";
import { Stamp } from "./Stamp";
import { playSound } from "@/lib/sound";

type PlacedStamp = {
  stamp: StampBrand;
  x: number;
  y: number;
};

/**
 * Right page (Figma node 2680:5144): "EXPERIENCE" header + a static dithered
 * image at the foot. The whole page is still a stamp canvas — click to press up
 * to three brand stamps. Pressing signals the parent so the booklet dips down
 * like a real stamp landing.
 */
export function StampCanvasPage({
  onPressStart,
  onPressEnd,
}: {
  onPressStart?: () => void;
  onPressEnd?: () => void;
}) {
  const [placed, setPlaced] = useState<PlacedStamp[]>([]);
  const nextStamp = stampBrands[placed.length];
  const isComplete = placed.length >= stampBrands.length;

  const placeStamp = (event: React.PointerEvent<HTMLDivElement>) => {
    onPressStart?.();
    if (!nextStamp) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    playSound("/sounds/stamp.mp3");
    setPlaced((current) =>
      current.length >= stampBrands.length
        ? current
        : [...current, { stamp: nextStamp, x, y }]
    );
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={
        isComplete ? "Stamp canvas complete" : `Place ${nextStamp.brand} stamp`
      }
      onPointerDown={placeStamp}
      onPointerUp={() => onPressEnd?.()}
      onPointerLeave={() => onPressEnd?.()}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && nextStamp) {
          event.preventDefault();
          onPressStart?.();
          playSound("/sounds/stamp.mp3");
          setPlaced((current) =>
            current.length >= stampBrands.length
              ? current
              : [
                  ...current,
                  {
                    stamp: nextStamp,
                    x: 50 + (current.length - 1) * 14,
                    y: 48 + current.length * 12,
                  },
                ]
          );
          window.setTimeout(() => onPressEnd?.(), 160);
        }
      }}
      className="relative h-full cursor-crosshair overflow-hidden bg-[#f9f9f9] px-4 py-6 outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
    >
      {/* static dithered image at the foot (Figma "Ditcher Design") */}
      <div className="pointer-events-none absolute bottom-0 left-[-19px] h-[252px] w-[339px] opacity-20">
        <Image
          src="/passport/dither.png"
          alt=""
          fill
          sizes="339px"
          className="object-cover object-bottom"
        />
      </div>

      {/* header */}
      <p className="pointer-events-none relative text-center font-mono text-[10px] tracking-[-0.3px] text-[#121212]">
        EXPERIENCE
      </p>

      {/* first-run hint */}
      {placed.length === 0 && (
        <div className="pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#121212]/34">
            Tap to stamp
          </p>
          <p className="mt-1.5 font-mono text-[8px] tracking-[-0.2px] text-[#121212]/34">
            Three marks · right page only
          </p>
        </div>
      )}

      {placed.map((placedStamp, index) => (
        <motion.div
          key={`${placedStamp.stamp.brand}-${index}`}
          className="absolute origin-center"
          style={{ left: `${placedStamp.x}%`, top: `${placedStamp.y}%` }}
          initial={{
            x: "-50%",
            y: "-50%",
            scale: 1.18,
            rotate: placedStamp.stamp.rotate - 4,
          }}
          animate={{
            x: "-50%",
            y: "-50%",
            scale: 1,
            rotate: placedStamp.stamp.rotate,
          }}
          transition={{ type: "spring", stiffness: 330, damping: 20 }}
        >
          <div className="scale-[1.08]">
            <Stamp stamp={placedStamp.stamp} index={index} animate={false} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
