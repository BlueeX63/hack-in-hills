"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePerformance } from "@/hooks/use-performance";
import { EVENT } from "@/lib/content";

const GLYPHS = "0123456789°'NESW.";

/**
 * Scrambles through glyphs before settling on the real string — a GPS trying to get a fix.
 * Runs once, on a timer rather than a frame loop, and is skipped under reduced motion.
 */
function useScramble(value: string, enabled: boolean) {
  // null means "not scrambling" — the real value is derived at render rather than copied
  // into state, so nothing has to be written back when the effect is skipped.
  const [scrambled, setScrambled] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    const total = 22;

    const id = window.setInterval(() => {
      frame += 1;
      // Lock characters left to right as the fix resolves.
      const locked = Math.floor((frame / total) * value.length);
      setScrambled(
        value
          .split("")
          .map((ch, i) => {
            if (i < locked || ch === " ") return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      if (frame >= total) {
        window.clearInterval(id);
        setScrambled(null);
      }
    }, 45);

    return () => window.clearInterval(id);
  }, [value, enabled]);

  return scrambled ?? value;
}

export default function NotFound() {
  const { reducedMotion, resolved } = usePerformance();
  const animate = resolved && !reducedMotion;

  const coords = useScramble("32.2396°N 77.1887°E", animate);
  const bearing = useScramble("— — —", animate);

  // The readout ticks, because an instrument that has lost its fix does not sit still.
  const elevationRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!animate) return;
    const id = window.setInterval(() => {
      const node = elevationRef.current;
      if (node) node.textContent = `${(Math.random() * 400 + 1800).toFixed(0)}M`;
    }, 320);
    return () => window.clearInterval(id);
  }, [animate]);

  return (
    <main className="relative min-h-screen w-full bg-[#0E0E0E] text-[#F4F1EA] overflow-hidden flex flex-col">
      {/* The ridge, with a route that stops. */}
      <svg
        aria-hidden
        viewBox="0 0 1440 620"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 w-full h-[62vh] pointer-events-none"
      >
        <path
          d="M0,470 L120,392 L232,438 L348,330 L470,404 L596,300 L700,372 L828,286 L944,360 L1066,300 L1192,392 L1312,336 L1440,404"
          fill="none"
          stroke="#8AA6BE"
          strokeWidth="1"
          strokeOpacity="0.28"
        />
        <path
          d="M0,556 L132,506 L272,548 L404,470 L520,528 L648,452 L780,524 L910,470 L1040,534 L1180,482 L1320,540 L1440,498"
          fill="none"
          stroke="#8AA6BE"
          strokeWidth="1.2"
          strokeOpacity="0.4"
        />

        {/* The route travelled, drawn in, ending abruptly. */}
        <motion.path
          d="M0,556 L132,506 L272,548 L404,470 L520,528 L648,452"
          fill="none"
          stroke="#FF512F"
          strokeWidth="2"
          strokeDasharray="5 6"
          initial={animate ? { pathLength: 0 } : false}
          animate={animate ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />

        {/* Last known position. */}
        <motion.g
          initial={animate ? { opacity: 0, scale: 0.6 } : false}
          animate={animate ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.5, delay: 2 }}
          style={{ transformOrigin: "648px 452px" }}
        >
          <circle cx="648" cy="452" r="16" fill="none" stroke="#FF512F" strokeOpacity="0.35" />
          <circle cx="648" cy="452" r="4.5" fill="#FF512F" />
        </motion.g>
      </svg>

      {/* Header strip */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 pt-8">
        <Link
          href="/"
          data-cursor-hover
          data-cursor-text="BASE CAMP"
          className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#F4F1EA]/50 hover:text-[#F4F1EA] transition-colors"
        >
          ← {EVENT.name}
        </Link>
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#FF512F] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF512F] animate-pulse" />
          Signal Lost
        </span>
      </header>

      {/* The statement */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 py-16">
        <motion.span
          initial={animate ? { opacity: 0, y: 12 } : false}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6 }}
          className="font-mono text-[10px] md:text-xs tracking-[0.35em] uppercase text-[#F4F1EA]/40 mb-6"
        >
          Error 404 · No Grid Reference
        </motion.span>

        <motion.h1
          initial={animate ? { opacity: 0, y: 24 } : false}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="font-display font-black uppercase tracking-tighter leading-[0.82] text-[19vw] md:text-[15vw] lg:text-[11rem] text-[#F4F1EA]"
        >
          Off
          <br />
          Route
        </motion.h1>

        <motion.p
          initial={animate ? { opacity: 0 } : false}
          animate={animate ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-sans text-base md:text-lg font-light text-[#F4F1EA]/55 max-w-md mt-8"
        >
          This path is not on the map. The page you asked for was never surveyed, or the
          route has since been closed.
        </motion.p>

        <motion.div
          initial={animate ? { opacity: 0, y: 12 } : false}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12"
        >
          <Link
            href="/"
            data-cursor="peak"
            data-cursor-text="DESCEND"
            data-cursor-alt="BASE CAMP"
            className="group inline-flex items-center gap-5 border border-[#F4F1EA]/25 hover:border-[#F4F1EA] px-7 py-5 font-mono text-[11px] tracking-[0.25em] uppercase font-bold transition-colors"
          >
            Return to Base Camp
            <span className="transition-transform duration-500 group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Instrument readout */}
      <motion.footer
        initial={animate ? { opacity: 0 } : false}
        animate={animate ? { opacity: 1 } : undefined}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="relative z-10 border-t border-[#F4F1EA]/12 px-6 md:px-12 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
      >
        <Readout label="Last Fix" value={coords} />
        <Readout label="Bearing" value={bearing} />
        <Readout label="Elevation">
          <span ref={elevationRef} className="tabular-nums">
            {EVENT.altitude}
          </span>
        </Readout>
        <Readout label="Status" value="Route Unmapped" accent />
      </motion.footer>
    </main>
  );
}

function Readout({
  label,
  value,
  children,
  accent,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#F4F1EA]/35">
        {label}
      </span>
      <span
        className={`font-mono text-[11px] md:text-xs tracking-[0.12em] uppercase ${
          accent ? "text-[#FF512F]" : "text-[#F4F1EA]/80"
        }`}
      >
        {children ?? value}
      </span>
    </div>
  );
}
