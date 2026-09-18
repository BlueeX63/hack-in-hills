"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePerformance } from "@/hooks/use-performance";

const tearPoints =
  "50% 0%, 58% 12%, 42% 18%, 56% 35%, 45% 42%, 55% 60%, 42% 70%, 58% 85%, 50% 100%";
const leftClip = `polygon(0 0, ${tearPoints}, 0 100%)`;
const rightClip = `polygon(100% 0, ${tearPoints}, 100% 100%)`;

/**
 * The original entrance plate, now served locally instead of fetched from Unsplash at
 * 1600px on first paint. The saturate/brightness/contrast grade the loader used to apply
 * in CSS is baked into the file, so no filter pass runs while the two halves are scaled
 * 10x through the tear.
 */
const loaderImage = "/loader-plate.webp";

type Stage = "loading" | "tearing" | "exit";

const TEAR_MS = 1500;
const FAST_TEAR_MS = 700;

const LoaderVisual = memo(function LoaderVisual({
  stage,
  tearMs,
  shadows,
}: {
  stage: Stage;
  tearMs: number;
  shadows: boolean;
}) {
  const tearTransition = { duration: tearMs / 1000, ease: [0.76, 0, 0.24, 1] as const };

  // drop-shadow on a clip-path'd, viewport-sized layer forces the browser to rebuild the
  // shadow from the irregular alpha mask on every frame — and this layer is simultaneously
  // being scaled 10x. Reserved for hardware that can absorb it.
  const half = (side: "left" | "right"): React.CSSProperties => ({
    willChange: "transform",
    clipPath: side === "left" ? leftClip : rightClip,
    ...(shadows
      ? {
          filter: `drop-shadow(${side === "left" ? "" : "-"}20px 0px 40px rgba(0,0,0,0.9))`,
        }
      : null),
  });

  return (
    <motion.div
      className="absolute top-[-10vh] bottom-[-10vh] left-[-10vw] right-[-10vw] origin-center"
      style={{ willChange: "transform" }}
      initial={{ scale: 1 }}
      animate={{ scale: stage === "tearing" ? 10 : 1, opacity: 1 }}
      transition={tearTransition}
    >
      {(["left", "right"] as const).map((side) => (
        <motion.div
          key={side}
          className={`absolute inset-0 w-full h-full flex items-center justify-center ${
            side === "left" ? "origin-left" : "origin-right"
          }`}
          style={half(side)}
          initial={{ x: 0 }}
          animate={{
            x:
              stage === "loading"
                ? side === "left"
                  ? "-1vw"
                  : "1vw"
                : side === "left"
                  ? "-30vw"
                  : "30vw",
          }}
          transition={stage === "loading" ? { duration: 15, ease: "linear" } : tearTransition}
        >
          <div className="absolute inset-0 bg-[#000000]">
            {/* Same src and same `sizes` as the hero plate, so both resolve to one
                optimised URL and the image is fetched exactly once. */}
            <Image
              src={loaderImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className={`object-cover object-center ${
                side === "right" ? "scale-105" : ""
              }`}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="font-sans font-light text-[5vw] tracking-[0.3em] text-white/90 whitespace-nowrap">
                HACK IN HILLS
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
});

const ProgressReadout = memo(function ProgressReadout({
  progress,
  stage,
}: {
  progress: number;
  stage: Stage;
}) {
  return (
    <motion.div
      className="absolute bottom-12 right-12 z-40 pointer-events-none mix-blend-difference flex flex-col items-end"
      animate={{
        opacity: stage === "tearing" ? 0 : 1,
        scale: stage === "tearing" ? 1.5 : 1,
      }}
      transition={{ duration: 0.5 }}
    >
      <div className="font-mono text-6xl font-bold text-white tracking-tighter">
        {progress}
        <span className="text-2xl text-accent">%</span>
      </div>
      <div className="font-mono text-xs tracking-[0.5em] text-white/50 uppercase mt-2">
        System Initialization
      </div>
    </motion.div>
  );
});

export function Loader({
  onComplete,
  onTearStart,
}: {
  onComplete: () => void;
  onTearStart?: () => void;
}) {
  const { budget, reducedMotion, resolved } = usePerformance();
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<Stage>("loading");

  // A slow machine should not be held on an intro animation longer than a fast one.
  const fast = reducedMotion || !budget.parallax;
  const tearMs = fast ? FAST_TEAR_MS : TEAR_MS;

  const finished = useRef(false);
  const timers = useRef<number[]>([]);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;

    timers.current.forEach(window.clearTimeout);
    timers.current = [];

    setProgress(100);
    setStage("tearing");
    onTearStart?.();

    timers.current.push(
      window.setTimeout(() => {
        setStage("exit");
        onComplete();
      }, tearMs)
    );
  }, [onComplete, onTearStart, tearMs]);

  useEffect(() => {
    // Wait for capability detection (one tick) so the intro is timed for the real tier
    // instead of starting on the conservative default and restarting.
    if (!resolved) return;

    if (reducedMotion) {
      finish();
      return;
    }

    // Pace the readout to a fixed wall-clock budget rather than a random step per tick,
    // so the intro takes the same time on every machine.
    const totalMs = fast ? 900 : 2200;
    const start = performance.now();

    const interval = window.setInterval(() => {
      const pct = Math.min(100, Math.round(((performance.now() - start) / totalMs) * 100));
      setProgress(pct);
      if (pct >= 100) {
        window.clearInterval(interval);
        timers.current.push(window.setTimeout(finish, 300));
      }
    }, 80);

    return () => window.clearInterval(interval);
  }, [fast, finish, reducedMotion, resolved]);

  // Let people out of the intro.
  useEffect(() => {
    const skip = () => finish();
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [finish]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(window.clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {stage !== "exit" && (
        <motion.div
          className="fixed inset-0 z-[999] bg-transparent pointer-events-none"
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          <LoaderVisual stage={stage} tearMs={tearMs} shadows={budget.parallax} />

          {budget.filmGrain && (
            <div
              aria-hidden
              className="absolute inset-0 z-30 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: "url(/noise.png)",
                backgroundRepeat: "repeat",
                backgroundSize: "128px 128px",
              }}
            />
          )}

          <ProgressReadout progress={progress} stage={stage} />

          <div className="absolute bottom-12 left-12 z-40 font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mix-blend-difference">
            Click
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
