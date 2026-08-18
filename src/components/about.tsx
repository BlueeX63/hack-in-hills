"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TopographicLines } from "./topographic-lines";

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[#F4F1EA] text-[#1A1A1A] py-32 md:py-48 px-6 md:px-12 overflow-hidden selection:bg-[#1A1A1A] selection:text-[#F4F1EA]"
    >
      <div className="max-w-[1600px] mx-auto flex flex-col items-start relative z-10">
        
        {/* Top: Section Header */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between mb-24 md:mb-32">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-[1px] bg-[#1A1A1A]" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#1A1A1A]/60">
                Expedition Details
              </span>
            </div>
            <motion.h2 
              className="font-display text-6xl md:text-8xl lg:text-[10vw] font-black uppercase tracking-tighter leading-[0.85]"
              style={{ y: y1 }}
            >
              THE<br />TERRAIN.
            </motion.h2>
          </div>
          <div className="mt-12 md:mt-0 font-mono text-sm tracking-widest text-[#1A1A1A]/40 uppercase text-left md:text-right pb-4">
            32.2396° N, 77.1887° E<br />
            ALTITUDE: 2,050M
          </div>
        </div>

        {/* Bottom: Mountain Ascent Cards Spanning Full Width */}
        <motion.div 
          className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4 relative"
          style={{ y: y2 }}
        >
          {/* Card 1 */}
          <div className="relative w-full group lg:mt-32">
            <div 
              className="relative bg-[#1A1A1A] text-[#F4F1EA] px-8 pb-12 pt-24 md:px-12 md:pb-12 md:pt-32 shadow-2xl transition-transform duration-700 ease-out group-hover:-translate-y-4"
              style={{
                clipPath: "polygon(0 15%, 20% 0%, 45% 10%, 75% 5%, 100% 20%, 100% 100%, 0 100%)"
              }}
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden mix-blend-overlay">
                <TopographicLines />
              </div>
              <div className="relative z-10">
                <div className="font-mono text-xs text-[#FF512F] mb-6 tracking-widest uppercase flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#FF512F] rounded-full animate-pulse" />
                  1,500M
                </div>
                <h3 className="font-display text-3xl font-bold uppercase tracking-tight mb-4">
                  Hostile By Design
                </h3>
                <p className="font-sans text-base text-[#F4F1EA]/70 leading-relaxed font-light">
                  We replaced the standard hackathon environment with the extreme atmospheric conditions of the Himalayas. Altitude drops oxygen. The cold tests endurance. Only the strongest architectures survive.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative w-full group lg:mt-16 lg:-ml-4 z-10">
            <div 
              className="relative bg-[#1A1A1A] text-[#F4F1EA] px-8 pb-12 pt-24 md:px-12 md:pb-12 md:pt-32 shadow-2xl transition-transform duration-700 ease-out group-hover:-translate-y-4"
              style={{
                clipPath: "polygon(0 10%, 30% 25%, 60% 0%, 85% 15%, 100% 5%, 100% 100%, 0 100%)"
              }}
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden mix-blend-overlay">
                <TopographicLines />
              </div>
              <div className="relative z-10">
                <div className="font-mono text-xs text-[#BDE0FE] mb-6 tracking-widest uppercase flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#BDE0FE] rounded-full animate-pulse" />
                  2,200M
                </div>
                <h3 className="font-display text-3xl font-bold uppercase tracking-tight mb-4">
                  48 Hours of Ice
                </h3>
                <p className="font-sans text-base text-[#F4F1EA]/70 leading-relaxed font-light">
                  This is a grueling, non-stop marathon. You will be pushed to your absolute limits. Build production-ready, globally scalable systems under immense pressure. We provide the infrastructure; you provide the brilliance.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative w-full group lg:-ml-8 z-20">
            <div 
              className="relative bg-[#1A1A1A] text-[#F4F1EA] px-8 pb-12 pt-32 md:px-12 md:pb-12 md:pt-40 shadow-2xl transition-transform duration-700 ease-out group-hover:-translate-y-4"
              style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 100%, 0 100%, 0 25%)"
              }}
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden mix-blend-overlay">
                <TopographicLines />
              </div>
              <div className="relative z-10">
                <div className="font-mono text-xs text-[#F4F1EA] mb-6 tracking-widest uppercase flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#F4F1EA] rounded-full animate-pulse" />
                  3,050M (SUMMIT)
                </div>
                <h3 className="font-display text-3xl font-bold uppercase tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                  Zero Compromise
                </h3>
                <p className="font-sans text-base text-[#F4F1EA]/70 leading-relaxed font-light">
                  Pitching takes place at the summit. Bring your finest code, or do not bring anything at all. Standard conventions and minimum viable products do not belong here. We are looking for the extraordinary.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Graphic Lines */}
      <TopographicLines />
    </section>
  );
}
