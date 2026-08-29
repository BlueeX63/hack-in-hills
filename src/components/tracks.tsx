"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TRACKS = [
  {
    id: "01",
    title: "ARTIFICIAL INTELLIGENCE",
    desc: "Build autonomous, self-healing systems that operate without human intervention in hostile data environments.",
    points: ["Ultra-low latency inference", "Real-time chaotic data streams", "Autonomous swarms"]
  },
  {
    id: "02",
    title: "CYBERSECURITY",
    desc: "Design impenetrable fortresses. Defend against simulated zero-day attacks while maintaining system uptime.",
    points: ["Adaptive cryptography", "Zero-Trust architecture", "Automated threat neutralizing"]
  },
  {
    id: "03",
    title: "WEB3 & DEPIN",
    desc: "The future is trustless. Build the decentralized infrastructure that powers the next era of human coordination.",
    points: ["Blockchain trilemma optimization", "zk-Rollups", "DePIN networks"]
  },
  {
    id: "04",
    title: "FINTECH",
    desc: "Redefine global capital flow. Strip away legacy financial bottlenecks and create frictionless monetary systems.",
    points: ["High-frequency transactions", "Zero gas fee models", "Algorithmic stability"]
  },
  {
    id: "05",
    title: "HEALTH-TECH",
    desc: "Code that saves lives. Push the boundaries of human longevity and medical data processing.",
    points: ["Genomic data parsing", "Pathological anomaly prediction", "Real-time biometric telemetry"]
  },
  {
    id: "06",
    title: "CLIMATE-TECH",
    desc: "Engineering for planetary survival. Build the software that reverses the damage of the industrial age.",
    points: ["Decentralized energy grids", "Battery waste reduction", "Carbon tracking ledgers"]
  }
];

export function Tracks() {
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  return (
    <section id="tracks" className="relative w-full bg-[#E6E1D6] text-[#1A1A1A] py-32 md:py-48 selection:bg-[#1A1A1A] selection:text-[#E6E1D6]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 border-b border-[#1A1A1A]/10 pb-8">
          <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter">
            THE TRACKS
          </h2>
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-[#1A1A1A]/50 mt-4 md:mt-0 max-w-xs text-right">
            Pick one track to build in. Your project must fit the theme you choose.
          </div>
        </div>

        {/* Interactive List */}
        <div className="w-full flex flex-col">
          {TRACKS.map((track) => {
            const isHovered = hoveredTrack === track.id;

            return (
              <div 
                key={track.id}
                onMouseEnter={() => setHoveredTrack(track.id)}
                onMouseLeave={() => setHoveredTrack(null)}
                className="group border-b border-[#1A1A1A]/10 last:border-0 relative cursor-none"
              >
                {/* The Visible Row */}
                <div className="py-8 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between relative z-10 transition-colors duration-500">
                  <div className="flex items-start md:items-center gap-6 md:gap-12">
                    <span className="font-mono text-xs md:text-sm text-[#1A1A1A]/40 tracking-widest mt-2 md:mt-0">
                      {track.id}
                    </span>
                    <h3 className={`font-display text-3xl md:text-5xl lg:text-7xl font-bold uppercase tracking-tighter transition-all duration-700 ${isHovered ? 'translate-x-4 opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
                      {track.title}
                    </h3>
                  </div>
                  
                  {/* Plus Icon that rotates */}
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-[#1A1A1A]/20 transition-transform duration-700" style={{ transform: isHovered ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 0V14M0 7H14" stroke="#1A1A1A" strokeWidth="1.5"/>
                    </svg>
                  </div>
                </div>

                {/* Expanding Content */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-12 pl-0 md:pl-[5.5rem] flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                        <p className="font-sans text-lg md:text-xl text-[#1A1A1A]/70 font-light max-w-lg leading-relaxed">
                          {track.desc}
                        </p>
                        <div className="flex flex-col gap-3">
                          {track.points.map((point, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A75]" />
                              <span className="font-mono text-sm tracking-wide text-[#1A1A1A]/80">{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Subtle Hover Background */}
                <div className={`absolute inset-0 bg-[#F4F1EA] -z-0 transition-opacity duration-500 pointer-events-none ${isHovered ? 'opacity-50' : 'opacity-0'}`} />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
