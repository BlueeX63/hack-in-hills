"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePerformance } from "@/hooks/use-performance";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** How far the element is allowed to travel toward the pointer, in px. */
  strength?: number;
};

/**
 * Pulls its child toward the cursor while the pointer is inside it, then releases on a
 * spring. Only the wrapper listens, and only while hovered, so there is no global
 * mousemove handler and nothing runs when the pointer is elsewhere on the page.
 */
export function Magnetic({ children, className, strength = 18 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { budget, coarsePointer, resolved } = usePerformance();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const enabled = resolved && budget.revealAnimations && !coarsePointer;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    // Offset from the element's centre, normalised to -1..1, then scaled.
    x.set(((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * strength);
    y.set(((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}
