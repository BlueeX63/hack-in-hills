"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MountainTransition } from "./mountain-transition";

const MILESTONES = [
  {
    id: "01",
    title: "BASE CAMP",
    date: "03 OCT 2026 · 08:00",
    desc: "Registration & Briefing. Oxygen levels normal.",
    elevation: "2,050M",
    align: "left"
  },
  {
    id: "02",
    title: "ASCENT START",
    date: "03 OCT 2026 · 10:00",
    desc: "Ideation and team formation. The clock begins.",
    elevation: "2,400M",
    align: "right"
  },
  {
    id: "03",
    title: "THE CRUX",
    date: "03 OCT 2026 · 15:00",
    desc: "Development phase. High pressure, intense coding.",
    elevation: "2,800M",
    align: "left"
  },
  {
    id: "04",
    title: "SUMMIT PITCH",
    date: "03 OCT 2026 · 20:00",
    desc: "Final evaluations. Only the best architectures survive.",
    elevation: "3,200M",
    align: "right"
  }
];

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lineDraw = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="timeline"
      ref={containerRef}
      className="relative w-full bg-[#F4F1EA] text-[#1A1A1A] pt-32 md:pt-48 overflow-hidden selection:bg-[#1A1A1A] selection:text-[#F4F1EA]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-32">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#1A1A1A]/50 mb-4 block">
            Elevation Profile
          </span>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter">
            EVENT<br />SCHEDULE
          </h2>
          <div className="mt-8 inline-flex items-center gap-3 self-center border border-[#1A1A1A]/20 px-5 py-2 md:px-6 md:py-2.5">
            <span className="w-1.5 h-1.5 bg-[#1A1A1A] rounded-full" />
            <span className="font-mono text-sm md:text-base font-bold tracking-[0.2em] uppercase text-[#1A1A1A]">
              03 October 2026
            </span>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
          
          {/* SVG Center Line */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-[#1A1A1A]/10" />
          <motion.div 
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-[#1A1A1A] origin-top"
            style={{ scaleY: lineDraw }}
          />

          {MILESTONES.map((milestone, index) => {
            const isLeft = milestone.align === "left";
            return (
              <div key={milestone.id} className="relative w-full flex justify-center mb-32 last:mb-0">
                
                {/* The Node */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#F4F1EA] border-2 border-[#1A1A1A] rounded-full z-20 flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#1A1A1A] rounded-full" />
                </div>

                {/* Content Left */}
                <div className={`w-1/2 pr-8 md:pr-16 flex flex-col items-end text-right ${!isLeft ? 'opacity-0 pointer-events-none' : ''}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <div className="font-mono text-[10px] tracking-widest text-[#1A1A1A]/40 mb-2 uppercase">
                      {milestone.date} // {milestone.elevation}
                    </div>
                    <h3 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">
                      {milestone.title}
                    </h3>
                    <p className="font-sans text-[#1A1A1A]/60 text-sm md:text-base font-light max-w-xs">
                      {milestone.desc}
                    </p>
                  </motion.div>
                </div>

                {/* Content Right */}
                <div className={`w-1/2 pl-8 md:pl-16 flex flex-col items-start text-left ${isLeft ? 'opacity-0 pointer-events-none' : ''}`}>
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <div className="font-mono text-[10px] tracking-widest text-[#1A1A1A]/40 mb-2 uppercase">
                      {milestone.date} // {milestone.elevation}
                    </div>
                    <h3 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">
                      {milestone.title}
                    </h3>
                    <p className="font-sans text-[#1A1A1A]/60 text-sm md:text-base font-light max-w-xs">
                      {milestone.desc}
                    </p>
                  </motion.div>
                </div>

              </div>
            );
          })}

        </div>
      </div>
      
      {/* Mountain Transition to next dark section */}
      <div className="mt-32 md:mt-48 w-full">
        <MountainTransition />
      </div>
    </section>
  );
}
