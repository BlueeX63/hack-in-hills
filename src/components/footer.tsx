"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { SnowParticles } from "./snow-particles";

export function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["50%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 1]);

  return (
    <footer 
      ref={containerRef}
      className="relative h-[80vh] md:h-[90vh] w-full bg-[#1A1A1A] text-[#F4F1EA] overflow-hidden"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <SnowParticles />
      <div className="fixed bottom-0 w-full h-[80vh] md:h-[90vh] flex flex-col justify-between pt-24 border-t border-[#F4F1EA]/10 z-10 pointer-events-none">
        
        {/* Top Grid */}
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-8">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#F4F1EA]/40 mb-2">Location</span>
            <div className="font-sans font-light">
              Manali, HP<br />
              India
            </div>
          </div>

          <div className="flex flex-col gap-4 pointer-events-auto">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#F4F1EA]/40 mb-2">Participate</span>
            <Link href="/register" className="font-sans font-light hover:text-[#6B7A75] transition-colors cursor-none w-fit">Register Team</Link>
            <Link href="/submit" className="font-sans font-light hover:text-[#6B7A75] transition-colors cursor-none w-fit">Submit Project</Link>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#F4F1EA]/40 mb-2">Connect</span>
            <a href="#" className="font-sans font-light hover:text-[#6B7A75] transition-colors cursor-none w-fit">Twitter</a>
            <a href="#" className="font-sans font-light hover:text-[#6B7A75] transition-colors cursor-none w-fit">Instagram</a>
            <a href="#" className="font-sans font-light hover:text-[#6B7A75] transition-colors cursor-none w-fit">Discord</a>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#F4F1EA]/40 mb-2">Legal</span>
            <a href="#" className="font-sans font-light hover:text-[#6B7A75] transition-colors cursor-none w-fit">Privacy Policy</a>
            <a href="#" className="font-sans font-light hover:text-[#6B7A75] transition-colors cursor-none w-fit">Terms of Service</a>
            <a href="#" className="font-sans font-light hover:text-[#6B7A75] transition-colors cursor-none w-fit">Code of Conduct</a>
          </div>

          <div className="flex flex-col justify-start md:items-end pointer-events-auto">
             <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group flex flex-col items-center gap-4 cursor-none"
              >
                <div className="w-16 h-16 rounded-full border border-[#F4F1EA]/20 flex items-center justify-center group-hover:bg-[#F4F1EA] transition-colors duration-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#F4F1EA] group-hover:text-[#1A1A1A] transition-colors duration-500">
                    <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#F4F1EA]/40">Back to Top</span>
             </button>
          </div>
        </div>

        {/* Massive Bottom Text */}
        <motion.div 
          style={{ y, opacity }}
          className="w-full flex justify-center items-end overflow-hidden mt-auto px-4 pb-4"
        >
          <h1 className="text-[14vw] font-display font-black uppercase tracking-tighter leading-[0.75] text-center text-[#F4F1EA]">
            HACK IN HILLS
          </h1>
        </motion.div>
        
      </div>
    </footer>
  );
}
