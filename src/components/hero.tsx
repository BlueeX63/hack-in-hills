"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { SnowParticles } from "./snow-particles";
import Link from "next/link";

export function Hero({ isLoaded = true }: { isLoaded?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-screen overflow-hidden bg-[#050505]"
    >
      {/* LAYER 1: Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: yBg }}
      >
        <img
          src="/hero-bg.png"
          alt="Himalayan Mountains"
          draggable={false}
          className="object-cover w-full h-[120%] object-center saturate-[0.2] contrast-[1.1] brightness-[0.8] select-none pointer-events-none"
        />
      </motion.div>

      {/* LAYER 2: Geometric Overlays */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none"
        style={{ x: smoothX, y: smoothY }}
      >
        <div className="w-[50vh] h-[50vh] md:w-[70vh] md:h-[70vh] rounded-full border-[1px] border-white/10 animate-[spin_60s_linear_infinite]" />
        <div className="absolute w-[65vh] h-[65vh] md:w-[85vh] md:h-[85vh] rounded-full border-[1px] border-white/5 border-dashed animate-[spin_90s_linear_infinite_reverse]" />
      </motion.div>

      {/* LAYER 3: Massive Typography (Slides behind cutout) */}
      <motion.div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none"
        style={{ y: yText }}
      >
        <div className="flex flex-col items-center justify-center w-full mt-[-18vh] md:mt-[-20vh] px-4 md:px-12">
          
          <div className="flex flex-col w-full relative">
            
            {/* Top row: HACK */}
            <div className="flex items-end justify-start w-full relative z-10">
              <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="font-display font-[var(--font-anton)] text-[25vw] md:text-[20vw] leading-[0.75] uppercase text-[#F4F1EA] drop-shadow-2xl mix-blend-overlay"
              >
                HACK
              </motion.div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="hidden md:flex flex-col ml-8 mb-[4vw]"
              >
                <div className="w-12 h-[1px] bg-white/40 mb-2" />
                <span className="font-mono text-xs tracking-[0.3em] text-white/60 uppercase">
                  ALT. 2050M
                </span>
                <span className="font-mono text-xs tracking-[0.3em] text-white/60 uppercase">
                  32.2396°N
                </span>
              </motion.div>
            </div>

            {/* Middle row: IN */}
            <div className="flex items-center justify-center w-full -my-[4vw] md:-my-[2vw] relative -z-10">
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                className="w-[15vw] h-[1px] bg-white/20 mr-6"
              />
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="font-serif italic text-5xl md:text-8xl text-[#BDE0FE]/90 drop-shadow-md"
              >
                in
              </motion.div>
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                className="w-[15vw] h-[1px] bg-white/20 ml-6"
              />
            </div>

            {/* Bottom row: HILLS */}
            <div className="flex items-start justify-end w-full relative z-20">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="hidden md:flex flex-col items-end mr-8 mt-[4vw]"
              >
                <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
                  INITIATING PROTOCOL
                </span>
                <div className="w-8 h-[1px] bg-white/20 mt-2" />
              </motion.div>
              <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                className="font-display font-[var(--font-anton)] text-[28vw] md:text-[22vw] leading-[0.75] uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#F4F1EA] via-white/80 to-transparent drop-shadow-2xl"
              >
                HILLS
              </motion.div>
            </div>

          </div>
        </div>
      </motion.div>

      {/* LAYER 4: The True Cinematic Mountain Cutout */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none select-none"
        style={{ y: yBg }}
      >
        <img
          src="/hero-fg-v2.png"
          alt="Foreground Mountain Cutout"
          draggable={false}
          className="object-cover w-full h-[120%] object-center saturate-[0.2] contrast-[1.1] brightness-[0.8] select-none pointer-events-none"
        />
        {/* Bottom gradient fade for UI readability and cinematic vignette */}
        <div className="absolute bottom-0 w-full h-[40vh] bg-gradient-to-t from-black/80 via-black/40 to-transparent z-40 pointer-events-none" />
      </motion.div>

      {/* LAYER 4.5: WebGL Snow Particles */}
      <SnowParticles />

      {/* Expedition Date Stamp */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        transition={{ duration: 1, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-8 md:bottom-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none"
      >
        <div className="flex flex-col items-center border border-white/30 bg-black/20 backdrop-blur-[2px] px-6 py-3 md:px-10 md:py-4">
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-white/50 uppercase mb-1">
            Expedition Date
          </span>
          <span className="font-display font-black text-2xl md:text-4xl tracking-tight text-[#F4F1EA] whitespace-nowrap">
            03 OCTOBER 2026
          </span>
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-white/50 uppercase mt-1">
            Manali · 2,050M
          </span>
        </div>
      </motion.div>

      {/* Top Right Registration Button (Leather Tag) */}
      <div className="absolute right-6 md:right-12 z-50 pointer-events-auto origin-top">
        <AnimatePresence>
          {isLoaded && (
            <Link href="/register" className="block cursor-none">
              <motion.div
                initial={{ y: -300 }}
                animate={{ y: 0 }}
                transition={{ 
                  duration: 1.5, 
                  type: "spring", 
                  stiffness: 50,
                  damping: 10,
                  delay: 0.5
                }}
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.95 }}
                className="relative w-[200px] h-[100px] md:w-[260px] md:h-[120px] group cursor-none"
              >
                {/* Magnetic Hover Target (invisible) */}
                <div className="absolute inset-0 z-20 cursor-none" />
                
                {/* The "Carved in Ice" Register Button Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/register-btn.png"
                  alt="Register"
                  draggable={false}
                  className="w-full h-full object-contain object-top mix-blend-multiply opacity-90 contrast-[1.2] saturate-[0.4] group-hover:opacity-100 transition-all select-none cursor-none"
                />
              </motion.div>
            </Link>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
