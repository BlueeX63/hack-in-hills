"use client";

import { motion } from "framer-motion";

const SPONSORS = [
  { id: "s1", name: "QUANTUM", tier: "TITLE PARTNER" },
  { id: "s2", name: "AEROSPACE", tier: "PLATINUM" },
  { id: "s3", name: "GLACIER.AI", tier: "GOLD" },
  { id: "s4", name: "NEXUS LABS", tier: "SILVER" },
  { id: "s5", name: "ALPINE TECH", tier: "COMMUNITY" },
  { id: "s6", name: "SUMMIT CO", tier: "COMMUNITY" },
  { id: "s7", name: "ELEVATE", tier: "TECH PARTNER" },
  { id: "s8", name: "FROST", tier: "TECH PARTNER" },
];

export function Sponsors() {
  return (
    <section className="relative w-full bg-[#E6E1D6] text-[#1A1A1A] py-32 md:py-48 selection:bg-[#1A1A1A] selection:text-[#E6E1D6]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 md:mb-32">
          <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter">
            THE ALLIES
          </h2>
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-[#1A1A1A]/50 mt-4 md:mt-0">
            Those who fund the expedition.
          </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-[#1A1A1A]/10">
          {SPONSORS.map((sponsor, index) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
              className="group flex flex-col items-center justify-center aspect-square border-r border-b border-[#1A1A1A]/10 p-8 cursor-none relative overflow-hidden"
            >
              {/* Subtle hover brackets */}
              <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-[#1A1A1A] opacity-0 group-hover:opacity-30 transition-all duration-500 -translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0" />
              <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-[#1A1A1A] opacity-0 group-hover:opacity-30 transition-all duration-500 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0" />
              <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-[#1A1A1A] opacity-0 group-hover:opacity-30 transition-all duration-500 -translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0" />
              <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-[#1A1A1A] opacity-0 group-hover:opacity-30 transition-all duration-500 translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0" />

              <div className="font-display text-2xl md:text-3xl font-black tracking-tighter text-[#1A1A1A]/80 group-hover:text-[#1A1A1A] group-hover:scale-105 transition-all duration-500 z-10">
                {sponsor.name}
              </div>
              <div className="mt-4 font-mono text-[10px] tracking-widest text-[#1A1A1A]/40 uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 z-10">
                {sponsor.tier}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
