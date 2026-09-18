"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { MountainTransition } from "./mountain-transition";
import { ScrollReveal, VelocitySkew } from "./ui/scroll-fx";
import { STAGES, EVENT } from "@/lib/content";
import { usePerformance } from "@/hooks/use-performance";


export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { budget } = usePerformance();

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
            Elevation Profile · Four Rounds
          </span>
          <VelocitySkew intensity={1.3}>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter">
              THE<br />ASCENT
            </h2>
          </VelocitySkew>
          <div className="mt-8 inline-flex items-center gap-3 self-center border border-[#1A1A1A]/20 px-5 py-2 md:px-6 md:py-2.5">
            <span className="w-1.5 h-1.5 bg-[#1A1A1A] rounded-full" />
            <span className="font-mono text-sm md:text-base font-bold tracking-[0.2em] uppercase text-[#1A1A1A]">
              Grand Finale · {EVENT.dateLine}
            </span>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center">

          {/* Background Center Line */}
          <div className="absolute top-0 bottom-0 left-0 md:left-1/2 -translate-x-1/2 w-px bg-[#1A1A1A]/10" />

          {/* Animated Center Line */}
          <motion.div
            className="absolute top-0 bottom-0 left-0 md:left-1/2 -translate-x-1/2 w-px bg-[#1A1A1A] origin-top"
            style={budget.parallax ? { scaleY: lineDraw } : { scaleY: 1 }}
          />

          {STAGES.map((milestone) => {
            const isLeft = milestone.align === "left";

            return (
              /*
               * Phones get a single column hung off a rail on the left — two half-width
               * columns at 375px left each side about 150px to hold a heading, a date, two
               * paragraphs and a 16:9 still, which overflowed the viewport by 241px.
               * From md up the original alternating layout is unchanged.
               */
              <div
                key={milestone.id}
                className="relative w-full flex flex-col md:flex-row md:justify-center mb-20 md:mb-44 last:mb-0 pl-10 md:pl-0"
              >
                {/* Timeline Node — on the rail on mobile, centred on the axis from md up. */}
                <div className="absolute left-0 top-2 md:left-1/2 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 w-4 h-4 bg-[#F4F1EA] border-2 border-[#1A1A1A] rounded-full z-20 flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#1A1A1A] rounded-full" />
                </div>

                {/* LEFT SIDE (desktop). Ordered so the still always leads on mobile. */}
                <div
                  className={`w-full md:w-1/2 md:pr-12 lg:pr-16 flex flex-col items-start md:items-end text-left md:text-right ${
                    isLeft ? "order-2" : "order-1"
                  } md:order-none`}
                >
                  {isLeft ? (
                    <MilestoneText milestone={milestone} align="right" />
                  ) : (
                    <MilestoneImage milestone={milestone} />
                  )}
                </div>

                {/* RIGHT SIDE (desktop). */}
                <div
                  className={`w-full md:w-1/2 md:pl-12 lg:pl-16 flex flex-col items-start text-left ${
                    isLeft ? "order-1" : "order-2"
                  } md:order-none`}
                >
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

type Stage = (typeof STAGES)[number];

function MilestoneText({
  milestone,
  align,
}: {
  milestone: Stage;
  align: "left" | "right";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "left" ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mt-6 md:mt-0"
      data-cursor="peak"
      data-cursor-text={`ROUND ${milestone.id}`}
      data-cursor-alt={milestone.elevation}
    >
      {/* Alignment is a class, not an inline style: mobile stacks left-aligned regardless
          of which side this milestone takes on the desktop axis. */}
      <div
        className={`font-mono text-[10px] tracking-widest text-[#1A1A1A]/40 mb-2 uppercase flex items-center gap-2 flex-wrap justify-start ${
          align === "right" ? "md:justify-end" : "md:justify-start"
        }`}
      >
        <span>Round {milestone.id}</span>
        {"status" in milestone && milestone.status ? (
          <span className="inline-flex items-center gap-1.5 text-[#1A1A1A]/70">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF512F] animate-pulse" />
            {milestone.status}
          </span>
        ) : null}
      </div>
      <h3 className="font-display text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight mb-2 leading-[0.95]">
        {milestone.title}
      </h3>
      <div className="font-mono text-[11px] md:text-xs tracking-[0.15em] text-[#1A1A1A]/50 uppercase mb-4">
        {milestone.window}
      </div>
      <p className="font-sans text-[#1A1A1A]/70 text-sm md:text-base font-light max-w-full md:max-w-sm mb-3">
        {milestone.summary}
      </p>
      <p className="font-sans text-[#1A1A1A]/50 text-xs md:text-sm font-light max-w-full md:max-w-sm mb-4">
        {milestone.detail}
      </p>
      {"link" in milestone && milestone.link ? (
        <a
          href={milestone.link.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-hover
          data-cursor-text="DOWNLOAD"
          className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase font-bold border-b border-[#1A1A1A] pb-1 hover:opacity-50 transition-opacity cursor-none mb-4"
        >
          {milestone.link.label}
          <span aria-hidden>↓</span>
        </a>
      ) : null}
      <div className="font-display font-[var(--font-anton)] text-lg md:text-xl tracking-tight text-[#1A1A1A]/55">
        {milestone.elevation}
      </div>
    </motion.div>
  );
}

function MilestoneImage({ milestone }: { milestone: Stage }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      data-cursor="view"
      data-cursor-text="VIEW"
      data-cursor-alt={milestone.elevation}
      className="group relative w-full md:max-w-[560px] lg:max-w-[650px] aspect-video overflow-hidden"
    >
      <ScrollReveal className="absolute inset-0">
      <Image
        src={milestone.image}
        alt={milestone.title}
        fill
        sizes="(max-width: 768px) 90vw, (max-width: 1200px) 560px, 650px"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        loading="lazy"
      />
      </ScrollReveal>
      <div className="absolute inset-0 ring-1 ring-inset ring-[#1A1A1A]/10" />
    </motion.div>
  );
}
