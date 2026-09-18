"use client";

import { ReactLenis } from "lenis/react";
import { usePerformance } from "@/hooks/use-performance";

/**
 * Smooth scrolling, but only where it is affordable.
 *
 * Perf notes — a lerp of 0.05 means every wheel tick produces a very long tail of
 * animation frames, and each of those frames re-runs every scroll-linked transform on the
 * page. That is the single most expensive thing on a weak CPU. The lerp now comes from the
 * device budget, and the low tier drops Lenis entirely for native scrolling.
 */
export function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const { budget, resolved } = usePerformance();

  // Render children directly until detection resolves, so we never mount Lenis and then
  // tear it down on a machine that cannot afford it.
  if (!resolved || budget.smoothScrollLerp === null) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: budget.smoothScrollLerp, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
