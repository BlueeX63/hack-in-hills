"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MountainTransition } from "./mountain-transition";
import { FAQS } from "@/lib/content";


export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="relative w-full bg-[#F4F1EA] text-[#1A1A1A] pt-32 md:pt-48 selection:bg-[#1A1A1A] selection:text-[#F4F1EA] overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center mb-20 md:mb-32 @container">
          <h2 className="font-display text-[6.5cqw] md:text-6xl font-black uppercase tracking-tighter">
            TRANSMISSIONS
          </h2>
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-[#1A1A1A]/50 mt-4">
            Frequently Asked Questions
          </div>
        </div>

        {/* The Accordion */}
        <div className="w-full border-t border-[#1A1A1A]/20">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div key={faq.id} className="border-b border-[#1A1A1A]/20 overflow-hidden cursor-none">
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  data-cursor="expand"
                  data-cursor-text={isOpen ? "CLOSE" : "OPEN"}
                  data-cursor-alt={`TRANSMISSION ${faq.id}`}
                  className="w-full py-6 md:py-8 flex items-start justify-between gap-5 md:gap-8 focus:outline-none group"
                >
                  <div className="flex items-start gap-3 md:gap-8 min-w-0">
                    <span className="font-mono text-[10px] tracking-widest text-[#1A1A1A]/40 uppercase shrink-0 pt-1.5 md:pt-2">
                      [{faq.id}]
                    </span>
                    <span className={`font-display text-lg sm:text-2xl md:text-3xl font-bold uppercase tracking-tight leading-tight transition-colors duration-500 text-left ${isOpen ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/60 group-hover:text-[#1A1A1A]'}`}>
                      {faq.question}
                    </span>
                  </div>
                  
                  {/* Elegant morphing plus/minus icon */}
                  <div className="relative w-4 h-4 shrink-0 mt-1.5 md:mt-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <motion.div 
                      className="absolute top-1/2 left-0 w-full h-[2px] bg-[#1A1A1A] -translate-y-1/2"
                    />
                    <motion.div 
                      className="absolute top-0 left-1/2 w-[2px] h-full bg-[#1A1A1A] -translate-x-1/2"
                      animate={{ rotate: isOpen ? 90 : 0, scaleY: isOpen ? 0 : 1 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="pb-10 md:pb-12 pl-9 md:pl-20 pr-2 font-sans text-base md:text-xl font-light text-[#1A1A1A]/70 leading-relaxed max-w-2xl">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
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
