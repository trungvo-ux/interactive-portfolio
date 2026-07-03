"use client";

import { type Stamp as StampData, inkColor } from "@/lib/passport";
import { cn } from "@/lib/utils";

/**
 * A rubber-stamp-style badge with inky texture (feTurbulence roughen),
 * hand-rotated, that presses onto the page on reveal.
 */
export function Stamp({
  stamp,
  index = 0,
  animate = true,
}: {
  stamp: StampData;
  index?: number;
  animate?: boolean;
}) {
  const color = inkColor[stamp.ink];
  const filterId = `ink-${stamp.ink}-${index}`;

  const shapeEl = () => {
    switch (stamp.shape) {
      case "oval":
        return <ellipse cx="90" cy="60" rx="82" ry="46" />;
      case "circle":
        return <circle cx="90" cy="60" r="52" />;
      case "rect":
        return <rect x="14" y="20" width="152" height="80" rx="2" />;
      default:
        return <rect x="20" y="20" width="140" height="80" rx="14" />;
    }
  };

  return (
    <div
      className={cn("stamp select-none mix-blend-multiply", animate && "opacity-0")}
      style={
        {
          ["--rot" as string]: `${stamp.rotate}deg`,
          transform: `rotate(${stamp.rotate}deg)`,
          opacity: animate ? undefined : 0.68,
          animation: animate
            ? `stamp-press 460ms cubic-bezier(0.34,1.36,0.64,1) forwards`
            : undefined,
          animationDelay: animate ? `${120 + index * 110}ms` : undefined,
          color,
        } as React.CSSProperties
      }
      aria-label={`${stamp.label} ${stamp.sub} ${stamp.code}`}
      role="img"
    >
      <svg width="168" height="112" viewBox="0 0 180 120" fill="none">
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed={index * 7 + 3}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2.2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <mask id={`m-${filterId}`}>
            <rect width="180" height="120" fill="white" />
            <rect
              width="180"
              height="120"
              fill="black"
              filter={`url(#${filterId})`}
              opacity="0.28"
            />
          </mask>
        </defs>

        <g
          stroke={color}
          fill="none"
          filter={`url(#${filterId})`}
          mask={`url(#m-${filterId})`}
        >
          {/* outer border */}
          <g strokeWidth="3.5">{shapeEl()}</g>
          {/* inner hairline for oval/circle */}
          {(stamp.shape === "oval" || stamp.shape === "circle") && (
            <g strokeWidth="1.5" opacity="0.8">
              {stamp.shape === "oval" ? (
                <ellipse cx="90" cy="60" rx="72" ry="37" />
              ) : (
                <circle cx="90" cy="60" r="44" />
              )}
            </g>
          )}

          {/* main label */}
          <text
            x="90"
            y="60"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="var(--font-geist-mono), monospace"
            fontSize="24"
            fontWeight="700"
            letterSpacing="1"
            fill={color}
            stroke="none"
          >
            {stamp.label}
          </text>
          {/* sub line */}
          <text
            x="90"
            y="83"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="var(--font-geist-mono), monospace"
            fontSize="8"
            letterSpacing="0.5"
            fill={color}
            stroke="none"
            opacity="0.9"
          >
            {stamp.sub.toUpperCase()}
          </text>
          {/* code / date */}
          <text
            x="90"
            y="40"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="var(--font-geist-mono), monospace"
            fontSize="9"
            fontWeight="600"
            fill={color}
            stroke="none"
          >
            {stamp.code}
          </text>
        </g>
      </svg>
    </div>
  );
}
