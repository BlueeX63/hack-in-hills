"use client";

import { usePerformance } from "@/hooks/use-performance";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /**
   * Blend the contours into the surface behind them. Compositor read-back is expensive,
   * so it is dropped automatically below the "high" tier and falls back to plain opacity.
   */
  blend?: "multiply" | "overlay";
};

/**
 * Decorative contour map. Rendered several times per page, so it deliberately stays a
 * handful of paths with no filters, no gradients and no animation.
 */
export function TopographicLines({ className, blend }: Props) {
  const { budget, resolved } = usePerformance();

  // Contours are pure texture — at the low tier they are the first thing to go.
  if (resolved && !budget.filmGrain && !budget.blendModes) return null;

  const blendClass =
    blend && resolved && budget.blendModes
      ? blend === "multiply"
        ? "mix-blend-multiply"
        : "mix-blend-overlay"
      : undefined;

  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none opacity-[0.03] overflow-hidden flex items-center justify-center",
        blendClass,
        className
      )}
    >
      <svg
        viewBox="0 0 1000 1000"
        className="w-[150%] md:w-full h-auto object-cover"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.5">
          {/* Contour Lines */}
          <path d="M 0 500 Q 250 400 500 500 T 1000 500" />
          <path d="M 0 550 Q 250 450 500 550 T 1000 550" />
          <path d="M 0 600 Q 250 500 500 600 T 1000 600" />
          <path d="M 0 650 Q 250 550 500 650 T 1000 650" />
          <path d="M 0 700 Q 250 600 500 700 T 1000 700" />
          <path d="M 0 750 Q 250 650 500 750 T 1000 750" />
          <path d="M 0 800 Q 250 700 500 800 T 1000 800" />
          <path d="M 0 450 Q 250 350 500 450 T 1000 450" />
          <path d="M 0 400 Q 250 300 500 400 T 1000 400" />
          <path d="M 0 350 Q 250 250 500 350 T 1000 350" />
          <path d="M 0 300 Q 250 200 500 300 T 1000 300" />

          {/* Elevation Rings / Peak */}
          <path d="M 300 300 C 400 200 600 200 700 300 C 600 400 400 400 300 300 Z" />
          <path d="M 350 300 C 420 230 580 230 650 300 C 580 370 420 370 350 300 Z" />
          <path d="M 400 300 C 450 260 550 260 600 300 C 550 340 450 340 400 300 Z" />
          <path d="M 450 300 C 480 280 520 280 550 300 C 520 320 480 320 450 300 Z" />

          {/* Subtle Markers */}
          <circle cx="500" cy="300" r="2" fill="currentColor" />
          <text
            x="510"
            y="303"
            fontSize="10"
            fontFamily="monospace"
            fill="currentColor"
            letterSpacing="0.2em"
          >
            PEAK_3200M
          </text>
        </g>
      </svg>
    </div>
  );
}
