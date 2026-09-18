"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePerformance } from "@/hooks/use-performance";
import { CountUp } from "./ui/count-up";
import { VelocitySkew } from "./ui/scroll-fx";
import { PRIZE } from "@/lib/content";

export function PrizePool() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { budget } = usePerformance();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section
      id="prizes"
      ref={containerRef}
      className="relative w-full bg-[#1A1A1A] text-[#F4F1EA] py-32 md:py-48 overflow-hidden selection:bg-[#F4F1EA] selection:text-[#1A1A1A]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col relative z-10">
        
        {/* Header */}
        <div className="flex flex-col mb-32">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#F4F1EA]/50 mb-4 block">
            The Reward
          </span>
          <div className="flex items-baseline gap-4">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter">
              PRIZE POOL
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
              {PRIZE.poolLabel}
            </div>
            <VelocitySkew intensity={1.6}>
              <div className="font-display text-[15vw] md:text-[10vw] font-black leading-none tracking-tighter text-[#E6E1D6] tabular-nums">
                <CountUp to={PRIZE.poolValue} prefix="₹" duration={2.2} />
              </div>
            </VelocitySkew>
          </motion.div>

          {/* Individual Prizes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
            {PRIZE.breakdown.map((tier, i) => {
              // The winner sits in the middle and rides the opposite parallax track.
              const isWinner = i === 0;
              return (
                <motion.div
                  key={tier.id}
                  data-cursor="peak"
                  data-cursor-text={tier.rank}
                  data-cursor-alt={`₹${tier.amount.toLocaleString("en-IN")}`}
                  style={budget.parallax ? { y: isWinner ? y2 : y1 } : undefined}
                  className={`flex flex-col border-l border-[#F4F1EA]/20 pl-6 ${
                    isWinner ? "md:order-2" : i === 1 ? "md:order-1" : "md:order-3"
                  }`}
                >
                  <div
                    className={`font-mono text-[10px] tracking-widest uppercase mb-4 flex items-center gap-2 ${
                      isWinner ? "text-[#E6E1D6]" : "text-[#F4F1EA]/40"
                    }`}
                  >
                    {isWinner && <span className="w-1.5 h-1.5 bg-[#6B7A75] rounded-full" />}
                    {tier.position}
                  </div>
                  <div
                    className={`font-display tracking-tighter mb-4 tabular-nums ${
                      isWinner
                        ? "text-4xl lg:text-5xl xl:text-6xl font-black text-[#E6E1D6]"
                        : "text-3xl lg:text-4xl xl:text-5xl font-bold"
                    }`}
                  >
                    <CountUp to={tier.amount} prefix="₹" duration={1.6} />
                  </div>
                  <p className="font-sans text-sm text-[#F4F1EA]/60 font-light">{tier.note}</p>
                </motion.div>
              );
            })}
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
