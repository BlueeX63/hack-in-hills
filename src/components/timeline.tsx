"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { MountainTransition } from "./mountain-transition";

const MILESTONES = [
  {
    id: "01",
    title: "Rapid Fire Pitch",
    date: "21 NOV 2026 · 23:00",
    desc: "Sixty seconds. One idea. No slides — just conviction under pressure.",
    elevation: "2,050M",
    align: "left",
    image: "/timeline-1.png",
  },
  {
    id: "02",
    title: "Treasure Hunting",
    date: "21 NOV 2026 · 16:00",
    desc: "An afternoon expedition across camp — clues, terrain, and a race against the clock.",
    elevation: "2,400M",
    align: "right",
    image: "/timeline-2.png",
  },
  {
    id: "03",
    title: "Bonfire",
    date: "21 NOV 2026 · 22:00",
    desc: "Gather at basecamp. Music, warmth, and a pause before the final ascent.",
    elevation: "2,800M",
    align: "left",
    image: "/timeline-3.png",
  },
  {
    id: "04",
    title: "Judging",
    date: "22 NOV 2026 · 04:00",
    desc: "Final architectures reviewed. Only the strongest builds reach the summit.",
    elevation: "3,200M",
    align: "right",
    image: "/timeline-4.png",
  },
];

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
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
              21 November 2026
            </span>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center">

          {/* Background Center Line */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-[#1A1A1A]/10" />

          {/* Animated Center Line */}
          <motion.div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-[#1A1A1A] origin-top"
            style={{ scaleY: lineDraw }}
          />

          {MILESTONES.map((milestone) => {
            const isLeft = milestone.align === "left";

            return (
              <div
                key={milestone.id}
                className="relative w-full flex justify-center mb-32 md:mb-44 last:mb-0"
              >
                {/* Timeline Node */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#F4F1EA] border-2 border-[#1A1A1A] rounded-full z-20 flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#1A1A1A] rounded-full" />
                </div>

                {/* LEFT SIDE */}
                <div className="w-1/2 pr-6 md:pr-12 lg:pr-16 flex flex-col items-end text-right">
                  {isLeft ? (
                    <MilestoneText milestone={milestone} align="right" />
                  ) : (
                    <MilestoneImage milestone={milestone} />
                  )}
                </div>

                {/* RIGHT SIDE */}
                <div className="w-1/2 pl-6 md:pl-12 lg:pl-16 flex flex-col items-start text-left">
                  {!isLeft ? (
                    <MilestoneText milestone={milestone} align="left" />
                  ) : (
                    <MilestoneImage milestone={milestone} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mountain Transition */}
      <div className="mt-32 md:mt-48 w-full">
        <MountainTransition />
      </div>
    </section>
  );
}

type Milestone = (typeof MILESTONES)[number];

function MilestoneText({
  milestone,
  align,
}: {
  milestone: Milestone;
  align: "left" | "right";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "left" ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="font-mono text-[10px] tracking-widest text-[#1A1A1A]/40 mb-2 uppercase">
        Checkpoint {milestone.id} · {milestone.date}
      </div>
      <h3 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight mb-3 leading-[0.95]">
        {milestone.title}
      </h3>
      <p className="font-sans text-[#1A1A1A]/60 text-sm md:text-base font-light max-w-xs mb-3">
        {milestone.desc}
      </p>
      <div className="font-display font-[var(--font-anton)] text-lg md:text-xl tracking-tight text-[#1A1A1A]/55">
        {milestone.elevation}
      </div>
    </motion.div>
  );
}

function MilestoneImage({ milestone }: { milestone: Milestone }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative w-full max-w-[420px] md:max-w-[560px] lg:max-w-[650px] aspect-video overflow-hidden"
    >
      <Image
        src={milestone.image}
        alt={milestone.title}
        fill
        sizes="(max-width: 768px) 90vw, (max-width: 1200px) 560px, 650px"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 ring-1 ring-inset ring-[#1A1A1A]/10" />
    </motion.div>
  );
}
