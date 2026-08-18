"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MountainTransition } from "./mountain-transition";

const FAQS = [
  {
    id: "01",
    question: "WHAT IS HACK IN HILLS?",
    answer: "A premier hackathon experience located at high altitude in Manali. It is designed to push your limits in engineering and creativity while surrounded by the Himalayas. We look for production-ready, globally scalable architectures."
  },
  {
    id: "02",
    question: "WHO CAN PARTICIPATE?",
    answer: "Anyone with the will to build. Students, professionals, designers, and explorers. Teams of 2 to 4 are recommended for maximum survivability and output."
  },
  {
    id: "03",
    question: "WHAT DO I NEED TO BRING?",
    answer: "Your hardware, warm clothing, and relentless drive. We provide the power, high-speed internet, and sustenance necessary to keep your systems online for 48 hours."
  },
  {
    id: "04",
    question: "IS THERE A REGISTRATION FEE?",
    answer: "Registration is completely free. However, selection is highly competitive. Only the most capable squads will be deployed to base camp."
  }
];

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="relative w-full bg-[#F4F1EA] text-[#1A1A1A] pt-32 md:pt-48 selection:bg-[#1A1A1A] selection:text-[#F4F1EA] overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center mb-24 md:mb-32">
          <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter">
            INTELLIGENCE
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
                  className="w-full py-8 flex items-center justify-between focus:outline-none group"
                >
                  <div className="flex items-center gap-8">
                    <span className="font-mono text-[10px] tracking-widest text-[#1A1A1A]/40 uppercase">
                      [{faq.id}]
                    </span>
                    <span className={`font-display text-2xl md:text-3xl font-bold uppercase tracking-tight transition-colors duration-500 text-left ${isOpen ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/60 group-hover:text-[#1A1A1A]'}`}>
                      {faq.question}
                    </span>
                  </div>
                  
                  {/* Elegant morphing plus/minus icon */}
                  <div className="relative w-4 h-4 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
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
                      <p className="pb-12 pl-14 md:pl-20 font-sans text-lg md:text-xl font-light text-[#1A1A1A]/70 leading-relaxed max-w-2xl">
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
