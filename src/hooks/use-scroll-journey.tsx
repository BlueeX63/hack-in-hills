"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";

/**
 * The ascent.
 *
 * The whole page is treated as one climb: 0 is the valley floor, 1 is the summit. Every
 * atmospheric layer reads from this single value, so the site visibly intensifies the
 * further down you scroll — thinner air, tighter contours, colder light, heavier snow.
 *
 * Perf note: this is deliberately ONE scroll subscription for the entire document, shared
 * through context. Before, each section opened its own `useScroll`, which meant a dozen
 * independent listeners and layout measurements competing on every scroll frame.
 */

export const BASE_ALTITUDE = 2050;
export const SUMMIT_ALTITUDE = 3200;

/** Named waypoints along the climb, as a fraction of total scroll. */
export const CAMPS = [
  { id: "00", label: "BASE CAMP", at: 0.0 },
  { id: "01", label: "CAMP I", at: 0.3 },
  { id: "02", label: "CAMP II", at: 0.58 },
  { id: "03", label: "HIGH CAMP", at: 0.8 },
  { id: "04", label: "SUMMIT", at: 1.0 },
] as const;

export type Camp = (typeof CAMPS)[number];

type Journey = {
  /** Raw scroll progress through the document, 0 to 1. */
  progress: MotionValue<number>;
  /** Spring-smoothed progress — use this for anything visual. */
  smooth: MotionValue<number>;
  /** Scroll speed, normalised to roughly -1..1 and eased. Drives velocity skew. */
  velocity: MotionValue<number>;
  /** Metres above sea level at the current position. */
  altitude: MotionValue<number>;
};

const JourneyContext = createContext<Journey | null>(null);

export function ScrollJourneyProvider({ children }: { children: React.ReactNode }) {
  const scrollYProgress = useMotionValue(0);

  // Measured here rather than with framer's `useScroll` because the page ships with its
  // content clamped to one viewport while the intro plays. `useScroll` caches the
  // scrollable height on mount, and the document growing afterwards fires no resize event,
  // so the progress stayed pinned near zero for the whole page. A ResizeObserver on the
  // body catches that growth.
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollYProgress.set(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };

    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    const observer = new ResizeObserver(update);
    observer.observe(document.body);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, [scrollYProgress]);

  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.0005,
  });

  const rawVelocity = useVelocity(scrollYProgress);
  // useVelocity reports progress-units per second, and the page is ~11k tall: a brisk
  // scroll is only about 0.14/s. The gain is calibrated so an ordinary scroll lands near
  // the middle of the -1..1 range and a hard flick saturates it.
  const velocity = useSpring(
    useTransform(rawVelocity, (v) => Math.max(-1, Math.min(1, v * 6))),
    { stiffness: 190, damping: 34 }
  );

  const altitude = useTransform(smooth, [0, 1], [BASE_ALTITUDE, SUMMIT_ALTITUDE]);

  const value = useMemo(
    () => ({ progress: scrollYProgress, smooth, velocity, altitude }),
    [scrollYProgress, smooth, velocity, altitude]
  );

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useScrollJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) {
    throw new Error("useScrollJourney must be used inside <ScrollJourneyProvider>");
  }
  return ctx;
}
