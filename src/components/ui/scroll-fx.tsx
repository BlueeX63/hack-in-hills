"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePerformance } from "@/hooks/use-performance";
import { useScrollJourney } from "@/hooks/use-scroll-journey";

/**
 * Scroll-reactive wrappers.
 *
 * All of these are transform-only, and every one of them falls back to a plain `div` when
 * the device budget says no parallax — so the low tier renders the same layout with none
 * of the per-frame work.
 */

/**
 * Leans and stretches with scroll speed. Scrolling fast pulls the content slightly out of
 * shape; stopping lets it settle. Reads from the one shared scroll velocity rather than
 * opening its own listener.
 */
export function VelocitySkew({
  children,
  className,
  intensity = 1,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const { budget } = usePerformance();
  const { velocity } = useScrollJourney();

  const skewY = useTransform(velocity, (v) => v * 2.6 * intensity);
  const scaleY = useTransform(velocity, (v) => 1 + Math.abs(v) * 0.05 * intensity);

  if (!budget.parallax) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} style={{ skewY, scaleY, transformOrigin: "center" }}>
      {children}
    </motion.div>
  );
}

/**
 * Slides horizontally as it passes through the viewport. Used on stacked rows with
 * alternating directions, so a grid shears apart and knits back together while scrolling.
 */
export function ScrollDrift({
  children,
  className,
  distance = 60,
  direction = 1,
}: {
  children: React.ReactNode;
  className?: string;
  /** Total travel in px across the element's pass through the viewport. */
  distance?: number;
  direction?: 1 | -1;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { budget, coarsePointer } = usePerformance();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [distance * direction, -distance * direction]
  );

  // Off on touch: there is no room to shear content sideways on a phone, and the travel
  // pushed rows past the viewport edge, which is what put a horizontal scrollbar on the
  // whole page. The ref still gets attached — useScroll is watching it either way, and
  // leaving it unmounted is what triggers motion's "target ref is not hydrated" warning.
  if (!budget.parallax || coarsePointer) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ x }}>
      {children}
    </motion.div>
  );
}

/**
 * Scrubbed reveal: the element un-masks and settles as it crosses the viewport, tied to
 * scroll position rather than firing once on entry — so scrolling back up plays it in
 * reverse.
 */
export function ScrollReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { budget } = usePerformance();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.35"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"]
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  if (!budget.parallax) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {/*
        * position: relative matters — this wrapper is the direct parent of whatever is
        * revealed, and next/image's `fill` requires a positioned ancestor. Leaving it
        * static is what produced 'provided "static" should be one of
        * absolute,fixed,relative'.
        */}
      <motion.div
        className="relative w-full h-full"
        style={{ clipPath, scale }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Counter-scrolls its children at a fraction of page speed, for depth between stacked
 * layers within one section.
 */
export function ScrollParallax({
  children,
  className,
  amount = 12,
}: {
  children: React.ReactNode;
  className?: string;
  /** Travel as a percentage of the element's own height. */
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { budget } = usePerformance();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`${amount}%`, `${-amount}%`]);

  if (!budget.parallax) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
