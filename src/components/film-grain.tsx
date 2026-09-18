"use client";

import { usePerformance } from "@/hooks/use-performance";

/**
 * Full-viewport film grain.
 *
 * Perf notes — this used to be an SVG `feTurbulence` filter stretched over the whole
 * viewport, which makes the browser evaluate a 3-octave fractal noise filter across every
 * pixel on screen and re-rasterise it on each resize. It is now a pre-generated 128px
 * tile repeated as a background image: one cached decode, zero filter work, and the layer
 * is static so the compositor never has to redraw it.
 */
export function FilmGrain() {
  const { budget, resolved } = usePerformance();

  if (!resolved || !budget.filmGrain) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.035]"
      style={{
        backgroundImage: "url(/noise.png)",
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
        contain: "strict",
      }}
    />
  );
}
