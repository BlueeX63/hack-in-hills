"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function Altimeter() {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Smooth out the scroll value
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Map scroll progress (0 to 1) to an altitude range (e.g., 2050 to 3200)
  const altitude = useTransform(smoothProgress, [0, 1], [2050, 3200]);
  const barHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  
  // Create a display string formatted with a comma
  const [displayAlt, setDisplayAlt] = useState("2,050");

  useEffect(() => {
    return altitude.onChange((latest) => {
      setDisplayAlt(Math.floor(latest).toLocaleString());
    });
  }, [altitude]);

  if (!mounted) return null;

  return (
    <div className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 z-50 mix-blend-difference text-[#F4F1EA] pointer-events-none hidden md:flex flex-col items-center gap-4">
      <div className="font-mono text-[10px] tracking-widest uppercase rotate-90 mb-8 opacity-50">
        ALTITUDE
      </div>
      
      {/* The Line */}
      <div className="w-[1px] h-32 bg-[#F4F1EA]/20 relative">
        <motion.div 
          className="absolute top-0 left-0 w-full bg-[#F4F1EA] origin-top"
          style={{ height: barHeight }}
        />
      </div>
      
      <div className="font-mono text-sm tracking-widest font-bold mt-4">
        {displayAlt}M
      </div>
    </div>
  );
}
