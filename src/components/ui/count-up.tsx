"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import { usePerformance } from "@/hooks/use-performance";

type Props = {
  to: number;
  /** Rendered before and after the number, e.g. "₹" and "+". */
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  /** Locale grouping, so 50000 reads as 50,000. */
  format?: (value: number) => string;
};

/**
 * Counts a figure up when it scrolls into view.
 *
 * The value is written straight into the DOM node rather than held in React state, so a
 * two-second count costs one text mutation per frame instead of ~120 re-renders.
 */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1.8,
  className,
  format = (v) => Math.round(v).toLocaleString("en-IN"),
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const { budget, resolved } = usePerformance();

  const animated = resolved && budget.revealAnimations;

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;

    if (!animated) {
      node.textContent = `${prefix}${format(to)}${suffix}`;
      return;
    }

    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => {
        node.textContent = `${prefix}${format(value)}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [animated, duration, format, inView, prefix, suffix, to]);

  return (
    <span ref={ref} className={className}>
      {/* Server-rendered value: the final figure, so it is correct without JS. */}
      {`${prefix}${format(to)}${suffix}`}
    </span>
  );
}
