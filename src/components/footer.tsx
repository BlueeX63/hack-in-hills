"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useScrollTo } from "@/hooks/use-scroll-to";
import { usePerformance } from "@/hooks/use-performance";

export function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTo = useScrollTo();
  const { budget, coarsePointer } = usePerformance();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["50%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 1]);

  return (
    <footer
      ref={containerRef}
      // Height is content-driven on phones. Pinning the contents to a locked 80vh meant the
      // six link groups — three rows once they stack two-up — grew past the available
      // height, and the bottom-anchored wordmark landed on top of the last column.
      className="relative h-auto md:h-[90vh] w-full bg-[#1A1A1A] text-[#F4F1EA] overflow-hidden"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      {/* The fixed layer is the desktop reveal: the footer scrolls up over pinned content.
          On mobile it is ordinary flow, so nothing can collide. */}
      <div className="relative md:fixed md:bottom-0 w-full md:h-[90vh] flex flex-col justify-between pt-20 md:pt-24 pb-12 md:pb-0 border-t border-[#F4F1EA]/10 z-10 md:pointer-events-none">

        {/* Top Grid */}
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-6 gap-x-6 gap-y-10 md:gap-6">
          {/* Location */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#F4F1EA]/40 mb-2">Location</span>
            <div className="font-sans font-light text-sm">
              Manali, HP<br />
              India
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4 pointer-events-auto">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#F4F1EA]/40 mb-2">Explore</span>
            <button onClick={() => scrollTo(0)} className="font-sans font-light text-sm hover:text-[#6B7A75] transition-colors cursor-none w-fit">Home</button>
            <button onClick={() => scrollTo(window.innerHeight)} className="font-sans font-light text-sm hover:text-[#6B7A75] transition-colors cursor-none w-fit">About</button>
            <button onClick={() => scrollTo(window.innerHeight * 2)} className="font-sans font-light text-sm hover:text-[#6B7A75] transition-colors cursor-none w-fit">Tracks</button>
          </div>

          {/* More Navigation */}
          <div className="flex flex-col gap-4 pointer-events-auto">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#F4F1EA]/40 mb-2">Discover</span>
            <button onClick={() => scrollTo(window.innerHeight * 3)} className="font-sans font-light text-sm hover:text-[#6B7A75] transition-colors cursor-none w-fit">Timeline</button>
            <button onClick={() => scrollTo(window.innerHeight * 4)} className="font-sans font-light text-sm hover:text-[#6B7A75] transition-colors cursor-none w-fit">Prizes</button>
            <button onClick={() => scrollTo(window.innerHeight * 5)} className="font-sans font-light text-sm hover:text-[#6B7A75] transition-colors cursor-none w-fit">Sponsors</button>
          </div>

          {/* Participate */}
          <div className="flex flex-col gap-4 pointer-events-auto">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#F4F1EA]/40 mb-2">Participate</span>
            <a href="https://unstop.com/competitions/1752595/register" target="_blank" rel="noopener noreferrer" className="font-sans font-light text-sm hover:text-[#6B7A75] transition-colors cursor-none w-fit">Register</a>
            <button onClick={() => scrollTo(window.innerHeight * 6)} className="font-sans font-light text-sm hover:text-[#6B7A75] transition-colors cursor-none w-fit">FAQ</button>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-4 pointer-events-auto">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#F4F1EA]/40 mb-2">Connect</span>
            <a href="https://x.com/HackInHills" target="_blank" rel="noopener noreferrer" className="font-sans font-light text-sm hover:text-[#6B7A75] transition-colors cursor-none w-fit">Twitter / X</a>
            <a href="https://www.instagram.com/hackinhills/" target="_blank" rel="noopener noreferrer" className="font-sans font-light text-sm hover:text-[#6B7A75] transition-colors cursor-none w-fit">Instagram</a>
            <a href="https://www.linkedin.com/company/hack-in-hills/" target="_blank" rel="noopener noreferrer" className="font-sans font-light text-sm hover:text-[#6B7A75] transition-colors cursor-none w-fit">LinkedIn</a>
          </div>

          {/* Back to Top */}
          <div className="flex flex-col justify-start items-start md:items-end pointer-events-auto">
             <button
                onClick={() => scrollTo(0)}
                data-cursor="peak"
                data-cursor-text="DESCEND"
                data-cursor-alt="BASE CAMP"
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
          style={budget.parallax && !coarsePointer ? { y, opacity } : undefined}
          className="w-full flex justify-center items-end overflow-hidden mt-16 md:mt-auto px-4 pb-4"
        >
          <h1 className="text-[15vw] md:text-[14vw] font-display font-black uppercase tracking-tighter leading-[0.75] text-center text-[#F4F1EA]">
            HACK IN HILLS
          </h1>
        </motion.div>
        
      </div>
    </footer>
  );
}
