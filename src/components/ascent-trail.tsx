"use client";

import { useRef } from "react";
import { motion, useMotionValueEvent, useTransform } from "framer-motion";
import { usePerformance } from "@/hooks/use-performance";
import { CAMPS, useScrollJourney, type Camp } from "@/hooks/use-scroll-journey";

/**
 * The route marker: a vertical line down the edge of the viewport that fills as the page
 * is climbed, with the expedition's camps marked along it. Replaces the plain altimeter —
 * same readout, but it now shows where you are on the climb rather than just how high.
 *
 * Nothing here re-renders on scroll: the altitude text and the camp highlight are written
 * straight into DOM nodes, and the fill is a transform on a single element.
 */
export function AscentTrail() {
  const { resolved } = usePerformance();
  const { smooth, altitude } = useScrollJourney();

  const readoutRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const campRefs = useRef<(HTMLDivElement | null)[]>([]);

  const fill = useTransform(smooth, [0, 1], [0, 1]);

  useMotionValueEvent(altitude, "change", (v) => {
    const next = `${Math.floor(v).toLocaleString("en-IN")}M`;
    const node = readoutRef.current;
    if (node && node.textContent !== next) node.textContent = next;
  });

  useMotionValueEvent(smooth, "change", (v) => {
    // Light every camp already passed, and name the most recent one.
    let reached: Camp = CAMPS[0];
    CAMPS.forEach((camp, i) => {
      const passed = v >= camp.at - 0.001;
      if (passed) reached = camp;
      const node = campRefs.current[i];
      if (node) node.dataset.reached = passed ? "true" : "false";
    });

    const label = labelRef.current;
    if (label && label.textContent !== reached.label) label.textContent = reached.label;
  });

  if (!resolved) return null;

  return (
    <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 mix-blend-difference text-[#F4F1EA] pointer-events-none hidden md:flex flex-col items-center gap-3">
      <div
        ref={labelRef}
        className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-60 mb-1 whitespace-nowrap"
      >
        {CAMPS[0].label}
      </div>

      <div className="relative w-[1px] h-52 bg-[#F4F1EA]/20">
        {/* Route travelled so far. */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-[#F4F1EA] origin-top"
          style={{ scaleY: fill }}
        />

        {/* Camps, pinned at their position along the climb. */}
        {CAMPS.map((camp, i) => (
          <div
            key={camp.id}
            ref={(el) => {
              campRefs.current[i] = el;
            }}
            data-reached={i === 0 ? "true" : "false"}
            className="absolute -left-[3px] w-[7px] h-[7px] rotate-45 border border-[#F4F1EA]/40 bg-transparent transition-colors duration-500 data-[reached=true]:bg-[#F4F1EA] data-[reached=true]:border-[#F4F1EA]"
            style={{ top: `calc(${camp.at * 100}% - 3px)` }}
          />
        ))}
      </div>

      <div ref={readoutRef} className="font-mono text-xs tracking-widest font-bold mt-2">
        2,050M
      </div>
    </div>
  );
}
