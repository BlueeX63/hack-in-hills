"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function MountainTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"]
  });

  // Parallax effect: the mountains rise up slightly as you scroll down to them
  const y = useTransform(scrollYProgress, [0, 1], ["20%", "0%"]);

  return (
    <div ref={ref} className="relative w-full h-[15vw] md:h-[10vw] overflow-hidden -mb-[1px]">
      <motion.div style={{ y }} className="absolute bottom-0 w-full h-full text-[#1A1A1A]">
        <svg 
          viewBox="0 0 1440 200" 
          preserveAspectRatio="none" 
          className="w-full h-full fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Jagged Mountain Silhouette */}
          <path d="M0,200 L0,180 L80,120 L150,160 L280,60 L380,140 L450,110 L580,40 L690,130 L800,80 L920,160 L1050,30 L1180,140 L1300,90 L1440,150 L1440,200 Z" />
          
          {/* Secondary Layer (lighter opacity for depth) */}
          <path fillOpacity="0.5" d="M0,200 L0,150 L100,80 L220,130 L350,50 L480,160 L600,90 L750,140 L880,50 L1000,120 L1150,70 L1320,160 L1440,110 L1440,200 Z" />
          
          {/* Tertiary Layer (even lighter) */}
          <path fillOpacity="0.2" d="M0,200 L0,120 L150,50 L280,110 L400,30 L550,130 L700,60 L850,150 L980,80 L1100,140 L1250,40 L1440,130 L1440,200 Z" />
        </svg>
      </motion.div>
    </div>
  );
}
