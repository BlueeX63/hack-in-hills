"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SnowParticles } from "./snow-particles";

export function PrizePool() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[#1A1A1A] text-[#F4F1EA] py-32 md:py-48 overflow-hidden selection:bg-[#F4F1EA] selection:text-[#1A1A1A]"
    >
      <SnowParticles />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col relative z-10">
        
        {/* Header */}
        <div className="flex flex-col mb-32">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#F4F1EA]/50 mb-4 block">
            The Reward
          </span>
          <div className="flex items-baseline gap-4">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter">
              BOUNTY
            </h2>
            <div className="w-full h-[1px] bg-[#F4F1EA]/20 hidden md:block" />
          </div>
        </div>

        {/* The Massive Typographic Exhibition */}
        <div className="flex flex-col gap-24 md:gap-32 w-full">
          
          {/* Total Pool */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center border-b border-[#F4F1EA]/10 pb-24"
          >
            <div className="font-mono text-sm tracking-widest text-[#F4F1EA]/40 uppercase mb-4">
              Total Prize Pool
            </div>
            <div className="font-display text-[15vw] md:text-[10vw] font-black leading-none tracking-tighter text-[#E6E1D6]">
              ₹5,00,000<span className="text-[#6B7A75]">+</span>
            </div>
          </motion.div>

          {/* Individual Prizes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
            
            {/* 1st Runner Up (Left) */}
            <motion.div 
              style={{ y: y1 }}
              className="flex flex-col border-l border-[#F4F1EA]/20 pl-6"
            >
              <div className="font-mono text-[10px] tracking-widest text-[#F4F1EA]/40 uppercase mb-4">
                02 // 1ST RUNNER UP
              </div>
              <div className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mb-4">
                ₹1,00,000
              </div>
              <p className="font-sans text-sm text-[#F4F1EA]/60 font-light">
                The Silver Chest. Awarded for exceptional architectural design.
              </p>
            </motion.div>

            {/* Winner (Center) */}
            <motion.div 
              style={{ y: y2 }}
              className="flex flex-col border-l border-[#F4F1EA]/20 pl-6"
            >
              <div className="font-mono text-[10px] tracking-widest text-[#E6E1D6] uppercase mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#6B7A75] rounded-full" />
                01 // THE SUMMIT
              </div>
              <div className="font-display text-4xl lg:text-5xl xl:text-6xl font-black tracking-tighter mb-4 text-[#E6E1D6]">
                ₹2,50,000
              </div>
              <p className="font-sans text-sm text-[#F4F1EA]/60 font-light">
                The Golden Relic. The ultimate prize for the most flawless system.
              </p>
            </motion.div>

            {/* 2nd Runner Up (Right) */}
            <motion.div 
              style={{ y: y1 }}
              className="flex flex-col border-l border-[#F4F1EA]/20 pl-6"
            >
              <div className="font-mono text-[10px] tracking-widest text-[#F4F1EA]/40 uppercase mb-4">
                03 // 2ND RUNNER UP
              </div>
              <div className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mb-4">
                ₹50,000
              </div>
              <p className="font-sans text-sm text-[#F4F1EA]/60 font-light">
                The Bronze Chest. Awarded for innovative disruption.
              </p>
            </motion.div>

          </div>
        </div>

      </div>

      {/* Subtle Background Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-[30vw] font-display font-black text-[#F4F1EA]/[0.02] pointer-events-none tracking-tighter text-center whitespace-nowrap overflow-hidden">
        HACK IN HILLS
      </div>
    </section>
  );
}
