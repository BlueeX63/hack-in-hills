"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TopographicLines } from "./topographic-lines";
import { usePerformance } from "@/hooks/use-performance";
import { CountUp } from "./ui/count-up";
import { SplitText } from "./ui/split-text";
import { EVENT, EXPECTATIONS, INTRO, TRACK_RECORD } from "@/lib/content";

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { budget } = usePerformance();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full bg-[#F4F1EA] text-[#1A1A1A] py-32 md:py-48 px-6 md:px-12 overflow-hidden selection:bg-[#1A1A1A] selection:text-[#F4F1EA]"
    >
      <div className="max-w-[1600px] mx-auto flex flex-col items-start relative z-10">
        
        {/* Top: Section Header */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24 md:mb-32">
          {/* @container: the headline is sized against THIS box, not the viewport, so it
              fits at every width regardless of how the flex row divides the space. */}
          <div className="min-w-0 @container md:basis-[64%] shrink">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-[1px] bg-[#1A1A1A]" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#1A1A1A]/60">
                {EVENT.format} · {EVENT.category} · {EVENT.teamSize}
              </span>
            </div>
            <motion.h2
              // "MARATHON." measures ~10em wide in Syne Black, so the type is capped at 1/10th
              // of the container at EVERY width. The old vw fallback below the @md breakpoint
              // overflowed a phone by 139px, because vw cannot know how wide this column is.
              className="font-display text-[9.4cqw] font-black uppercase tracking-tighter leading-[0.85] max-w-full"
              style={budget.parallax ? { y: y1 } : undefined}
            >
              <SplitText as="div">NOT A MARATHON.</SplitText>
              <SplitText as="div">A MOUNTAIN SPRINT.</SplitText>
            </motion.h2>
          </div>
          <div className="mt-12 md:mt-0 font-mono text-sm tracking-widest text-[#1A1A1A]/40 uppercase text-left md:text-right pb-4">
            {EVENT.coordinates}<br />
            ALTITUDE: {EVENT.altitude}<br />
            {EVENT.venue}
          </div>
        </div>

        {/* The pitch, then the organisers' record behind it. */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-28 md:mb-36">
          <div className="lg:col-span-7 flex flex-col gap-6">
            {INTRO.map((paragraph, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "font-sans text-xl md:text-2xl lg:text-3xl font-light leading-[1.35] text-[#1A1A1A]"
                    : "font-sans text-base md:text-lg font-light leading-relaxed text-[#1A1A1A]/60 max-w-xl"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-x-8 gap-y-10 lg:pl-8 lg:border-l border-[#1A1A1A]/15">
            {TRACK_RECORD.map((stat) => (
              <div
                key={stat.label}
                data-cursor="peak"
                data-cursor-text="RECORD"
                data-cursor-alt={stat.label.toUpperCase()}
                className="flex flex-col"
              >
                <CountUp
                  to={stat.value}
                  suffix={stat.suffix}
                  className="font-display font-black text-4xl md:text-5xl tracking-tighter tabular-nums"
                />
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/45 mt-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* What the event itself looks like. */}
        <div className="w-full border-t border-[#1A1A1A]/15 mb-24 md:mb-32">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {EXPECTATIONS.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-2 py-8 px-4 first:pl-0 border-r last:border-r-0 border-[#1A1A1A]/10"
              >
                <span className="font-display font-black text-2xl md:text-3xl tracking-tighter">
                  {item.value}
                </span>
                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/45 leading-relaxed">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Mountain Ascent Cards Spanning Full Width */}
        <motion.div 
          className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4 relative"
          style={budget.parallax ? { y: y2 } : undefined}
        >
          {/* Card 1 */}
          <div
            data-cursor="peak"
            data-cursor-text="SELECTION"
            data-cursor-alt="1,900M"
            className="relative w-full group lg:mt-32">
            <div 
              className="relative bg-[#1A1A1A] text-[#F4F1EA] px-8 pb-12 pt-24 md:px-12 md:pb-12 md:pt-32 shadow-2xl transition-transform duration-700 ease-out group-hover:-translate-y-4"
              style={{
                clipPath: "polygon(0 15%, 20% 0%, 45% 10%, 75% 5%, 100% 20%, 100% 100%, 0 100%)"
              }}
            >
              <TopographicLines blend="overlay" className="opacity-10" />
              <div className="relative z-10">
                <div className="font-mono text-xs text-[#FF512F] mb-6 tracking-widest uppercase flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#FF512F] rounded-full animate-pulse" />
                  1,900M
                </div>
                <h3 className="font-display text-3xl font-bold uppercase tracking-tight mb-4">
                  Four Rounds To The Summit
                </h3>
                <p className="font-sans text-base text-[#F4F1EA]/70 leading-relaxed font-light">
                  Idea and deck, then a prototype round open to every team, then a public pitch. Ten teams make it to Manali.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div
            data-cursor="peak"
            data-cursor-text="THE BUILD"
            data-cursor-alt="2,300M"
            className="relative w-full group lg:mt-16 lg:-ml-4 z-10">
            <div 
              className="relative bg-[#1A1A1A] text-[#F4F1EA] px-8 pb-12 pt-24 md:px-12 md:pb-12 md:pt-32 shadow-2xl transition-transform duration-700 ease-out group-hover:-translate-y-4"
              style={{
                clipPath: "polygon(0 10%, 30% 25%, 60% 0%, 85% 15%, 100% 5%, 100% 100%, 0 100%)"
              }}
            >
              <TopographicLines blend="overlay" className="opacity-10" />
              <div className="relative z-10">
                <div className="font-mono text-xs text-[#BDE0FE] mb-6 tracking-widest uppercase flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#BDE0FE] rounded-full animate-pulse" />
                  2,300M
                </div>
                <h3 className="font-display text-3xl font-bold uppercase tracking-tight mb-4">
                  24+ Hours At Altitude
                </h3>
                <p className="font-sans text-base text-[#F4F1EA]/70 leading-relaxed font-light">
                  The finale runs through the night in Manali. Build, refine and present in front of mentors, speakers and judges with the Himalayas outside the window.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div
            data-cursor="peak"
            data-cursor-text="THE SUMMIT"
            data-cursor-alt="3,200M"
            className="relative w-full group lg:-ml-8 z-20">
            <div 
              className="relative bg-[#1A1A1A] text-[#F4F1EA] px-8 pb-12 pt-32 md:px-12 md:pb-12 md:pt-40 shadow-2xl transition-transform duration-700 ease-out group-hover:-translate-y-4"
              style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 100%, 0 100%, 0 25%)"
              }}
            >
              <TopographicLines blend="overlay" className="opacity-10" />
              <div className="relative z-10">
                <div className="font-mono text-xs text-[#F4F1EA] mb-6 tracking-widest uppercase flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#F4F1EA] rounded-full animate-pulse" />
                  3,200M (SUMMIT)
                </div>
                <h3 className="font-display text-3xl font-bold uppercase tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                  Judged On Substance
                </h3>
                <p className="font-sans text-base text-[#F4F1EA]/70 leading-relaxed font-light">
                  Innovation, technical execution, impact, scalability, problem–solution fit, usability and final presentation. Nothing else.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Graphic Lines */}
      <TopographicLines blend="multiply" />
    </section>
  );
}
