"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePerformance } from "@/hooks/use-performance";
import { ParticleLogo } from "./particle-logo";
import { EVENT } from "@/lib/content";

export function Hero({ isLoaded = true }: { isLoaded?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { budget } = usePerformance();

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
    if (!budget.parallax) return;

    let frame = 0;
    let pending: { x: number; y: number } | null = null;

    const flush = () => {
      frame = 0;
      if (!pending) return;
      mouseX.set(pending.x);
      mouseY.set(pending.y);
      pending = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      pending = {
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      };
      if (!frame) frame = requestAnimationFrame(flush);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [budget.parallax, mouseX, mouseY]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full h-screen min-h-screen overflow-hidden bg-[#050505]"
    >
      {/* LAYER 1: Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        style={budget.parallax ? { y: yBg } : undefined}
      >
        {/* The saturate/contrast/brightness grade is baked into the WebP, so no filter
            pass runs while these layers move. */}
        <div className="relative w-full h-[120%]">
          <Image
            src="/hero-bg.webp"
            alt="Himalayan mountains at altitude"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            draggable={false}
            className="object-cover object-center select-none pointer-events-none"
          />
        </div>
      </motion.div>

      {/* LAYER 2: Geometric Overlays */}
      {/* Two viewport-scale layers rotating forever — held back to the tiers that can
          composite them without dropping frames. */}
      {budget.parallax && (
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none"
          style={{ x: smoothX, y: smoothY }}
        >
          <div className="w-[50vh] h-[50vh] md:w-[70vh] md:h-[70vh] rounded-full border-[1px] border-white/10 animate-[spin_60s_linear_infinite]" />
          <div className="absolute w-[65vh] h-[65vh] md:w-[85vh] md:h-[85vh] rounded-full border-[1px] border-white/5 border-dashed animate-[spin_90s_linear_infinite_reverse]" />
        </motion.div>
      )}

      {/* LAYER 2.5: The summit mark assembling itself out of snow — the survey reading of
          the same ridge the photograph shows below it. Cropped to the mountain alone; the
          lockup's wordmark would only repeat the headline in front of it. */}
      <div className="absolute inset-0 z-[15] flex items-center justify-center pointer-events-none select-none">
        <div className="relative w-[118vw] h-[74vh] md:w-[104vw] md:h-[80vh] mt-[-16vh] md:mt-[-19vh]">
          <ParticleLogo
            className="absolute inset-0"
            crop={{ bottom: 0.42 }}
            fit={1.15}
            density={3000}
            color="rgba(205,228,250,0.42)"
          />
        </div>
      </div>

      {/* LAYER 3: Massive Typography (Slides behind cutout) */}
      <motion.div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none"
        style={budget.parallax ? { y: yText } : undefined}
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
        style={budget.parallax ? { y: yBg } : undefined}
      >
        <div className="relative w-full h-[120%]">
          <Image
            src="/hero-fg-v2.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            draggable={false}
            className="object-cover object-center select-none pointer-events-none"
          />
        </div>
        {/* Bottom gradient fade for UI readability and cinematic vignette */}
        <div className="absolute bottom-0 w-full h-[40vh] bg-gradient-to-t from-black/80 via-black/40 to-transparent z-40 pointer-events-none" />
      </motion.div>

      {/* Expedition Date Stamp */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        transition={{ duration: 1, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-8 md:bottom-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none"
      >
        <div className="flex flex-col items-center border border-white/30 bg-black/20 backdrop-blur-[2px] px-4 py-3 sm:px-6 md:px-10 md:py-4 max-w-[92vw]">
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] text-white/50 uppercase mb-1">
            Grand Finale · {EVENT.durationLine}
          </span>
          <span className="font-display font-[var(--font-anton)] text-xl sm:text-3xl md:text-5xl tracking-wide uppercase text-[#F4F1EA] whitespace-nowrap drop-shadow-lg">
            {EVENT.dateLine}
          </span>
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-white/50 uppercase mt-1">
            Manali · {EVENT.altitude} · {EVENT.format}
          </span>
        </div>
      </motion.div>

      {/* Top Right Registration Button (Leather Tag) */}
      <div className="absolute right-4 top-20 md:right-12 md:top-0 z-50 pointer-events-auto origin-top">
        <AnimatePresence>
          {isLoaded && (
            <Link
              href={EVENT.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="peak"
              data-cursor-text="REGISTER"
              data-cursor-alt="BEGIN ASCENT"
              className="block cursor-none"
            >
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
                className="relative w-[150px] h-[75px] sm:w-[180px] sm:h-[90px] md:w-[260px] md:h-[120px] group cursor-none"
              >
                {/* Magnetic Hover Target (invisible) */}
                <div className="absolute inset-0 z-20 cursor-none" />
                
                {/* The "Carved in Ice" Register Button Image */}
                <Image
                  src="/register-btn.webp"
                  alt="Register"
                  fill
                  sizes="260px"
                  draggable={false}
                  className={`object-contain object-top opacity-90 group-hover:opacity-100 transition-opacity select-none cursor-none ${
                    budget.blendModes
                      ? "mix-blend-multiply contrast-[1.2] saturate-[0.4]"
                      : ""
                  }`}
                />
              </motion.div>
            </Link>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
