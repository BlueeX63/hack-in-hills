"use client";

import { useMemo, useRef } from "react";
import { motion, useMotionValueEvent, useTransform } from "framer-motion";
import { usePerformance } from "@/hooks/use-performance";
import { useScrollJourney } from "@/hooks/use-scroll-journey";

/**
 * The weather system for the whole climb.
 *
 * One fixed overlay that sits above the sections and below the UI, driven entirely by
 * global scroll progress. Near the valley it is almost nothing; the further down the page
 * you go, the colder and more hostile it gets — the vignette closes in, contour rings
 * tighten around the viewport, snow switches on flake by flake, and wind streaks start
 * cutting across the last stretch to the summit.
 *
 * Perf: no per-frame React renders. Scroll progress is written once per frame into a
 * single CSS custom property, and every layer below derives its own opacity from it in
 * CSS. Transforms and opacity only, so it stays on the compositor.
 */

const FLAKE_COUNT = 90;

/**
 * Skyline profiles, back to front. Irregular on purpose — evenly spaced peaks of equal
 * height read as a chart rather than a range. `threshold` is the point in the climb at
 * which each ridge resolves, `bias` gives the furthest ones a head start so the horizon is
 * already suggested at base camp, and `max` keeps each one as a hint rather than a subject.
 */
const RIDGES = [
  {
    id: "far",
    width: 0.75,
    threshold: 0.04,
    bias: 0.12,
    max: 0.2,
    d: "M0,300 L86,252 L148,272 L232,188 L292,218 L378,164 L468,238 L552,196 L638,242 L728,174 L818,226 L922,182 L1012,246 L1100,204 L1196,254 L1290,210 L1374,248 L1440,220",
  },
  {
    id: "mid-far",
    width: 0.9,
    threshold: 0.22,
    bias: 0.05,
    max: 0.24,
    d: "M0,358 L74,318 L162,344 L236,262 L318,300 L404,232 L496,312 L582,268 L664,320 L766,240 L852,296 L946,252 L1044,326 L1142,278 L1246,330 L1344,286 L1440,318",
  },
  {
    id: "mid",
    width: 1.05,
    threshold: 0.42,
    bias: 0.03,
    max: 0.28,
    d: "M0,424 L96,382 L178,410 L268,318 L342,364 L440,296 L528,378 L618,330 L712,386 L814,304 L902,360 L1004,314 L1102,392 L1204,340 L1312,396 L1440,352",
  },
  {
    id: "mid-near",
    width: 1.2,
    threshold: 0.6,
    bias: 0.0,
    max: 0.32,
    d: "M0,492 L82,446 L176,478 L262,388 L350,438 L446,362 L536,446 L630,396 L722,452 L828,372 L918,428 L1022,380 L1124,458 L1228,404 L1336,462 L1440,416",
  },
] as const;

/** Foreground crest, the last thing to resolve before the summit. */
const NEAR_RIDGE =
  "M0,566 L92,514 L190,552 L282,468 L368,522 L468,442 L560,528 L656,474 L752,536 L860,452 L952,512 L1058,462 L1160,542 L1266,486 L1372,548 L1440,506";

/** Deterministic, so the field is identical between server and client renders. */
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function AscentAtmosphere() {
  const { budget, resolved } = usePerformance();
  const { smooth } = useScrollJourney();
  const rootRef = useRef<HTMLDivElement>(null);

  // One DOM write per frame. Everything else reacts in CSS.
  useMotionValueEvent(smooth, "change", (v) => {
    rootRef.current?.style.setProperty("--storm", v.toFixed(4));
  });

  // The range rises into frame as the climb progresses. Far ridges move least.
  const ridgeRiseFar = useTransform(smooth, [0, 1], ["14%", "0%"]);
  const ridgeRiseNear = useTransform(smooth, [0, 1], ["34%", "-4%"]);

  const flakes = useMemo(
    () =>
      Array.from({ length: FLAKE_COUNT }, (_, i) => ({
        id: i,
        left: rand(i + 1) * 100,
        size: rand(i + 4.2) * 2.6 + 1,
        duration: rand(i + 7.7) * 11 + 7,
        delay: rand(i + 11.3) * -18,
        drift: rand(i + 15.9) * 46 - 16,
        // Flakes switch on progressively, so the storm builds as you climb.
        threshold: (i / FLAKE_COUNT) * 0.78,
      })),
    []
  );

  if (!resolved || budget.snowParticles === 0) return null;

  // Lower tiers keep the vignette and contours but carry far fewer flakes.
  const flakeBudget = budget.snowParticles >= 40 ? FLAKE_COUNT : Math.round(FLAKE_COUNT * 0.35);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      style={{ ["--storm" as string]: 0, contain: "strict" }}
    >
      {/* Cold vignette — the air closing in. Darkens the edges of any section beneath. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 95% at 50% 38%, transparent 34%, rgba(10,22,38,0.42) 78%, rgba(6,14,26,0.72) 100%)",
          opacity: "calc(var(--storm) * 0.95)",
        }}
      />

      {/* Glacier wash — the light turns blue as the altitude builds. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(120,170,210,0.16) 0%, transparent 42%, rgba(24,52,86,0.22) 100%)",
          opacity: "calc(var(--storm) * 0.85)",
        }}
      />

      {/* The range itself. Layered ridgelines that rise into frame and gain definition as
          the climb goes on — the far skyline resolving out of the weather, rather than a
          set of abstract rings. */}
      <motion.svg
        viewBox="0 0 1440 620"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 w-full h-[78vh]"
        style={{ y: ridgeRiseFar }}
      >
        <g fill="none" stroke="#8AA6BE" strokeLinejoin="round" strokeLinecap="round">
          {RIDGES.map((ridge) => (
            <path
              key={ridge.id}
              d={ridge.d}
              strokeWidth={ridge.width}
              style={{
                // Each ridge resolves at its own altitude, nearest last.
                opacity: `clamp(0, calc((var(--storm) + ${ridge.bias} - ${ridge.threshold}) * 3), ${ridge.max})`,
              }}
            />
          ))}
        </g>
      </motion.svg>

      {/* Nearest ridge, carried on a faster parallax track for depth. */}
      <motion.svg
        viewBox="0 0 1440 620"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 w-full h-[78vh]"
        style={{ y: ridgeRiseNear }}
      >
        <path
          d={NEAR_RIDGE}
          fill="none"
          stroke="#B9D4EA"
          strokeWidth="1.3"
          strokeLinejoin="round"
          style={{ opacity: "clamp(0, calc((var(--storm) - 0.42) * 2.2), 0.34)" }}
        />
      </motion.svg>

      {/* Snow. Each flake has its own switch-on point, so the field thickens with altitude. */}
      <div className="absolute inset-0">
        {flakes.slice(0, flakeBudget).map((f) => (
          <div
            key={f.id}
            className="absolute top-[-6%] rounded-full animate-snowfall"
            style={
              {
                left: `${f.left}%`,
                width: `${f.size}px`,
                height: `${f.size}px`,
                // Slate-blue reads on both the cream and the charcoal sections.
                background: "rgba(158,190,214,0.75)",
                animationDuration: `${f.duration}s`,
                animationDelay: `${f.delay}s`,
                "--snow-drift": `${f.drift}px`,
                "--threshold": f.threshold,
                // +0.12 keeps a light dusting falling at base camp; the rest switch
                // on as the storm builds toward the summit.
                opacity:
                  "clamp(0, calc((var(--storm) + 0.12 - var(--threshold)) * 7), 1)",
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Meteors over the range, only in the final push to the summit. They all fall the
          same way, the way a real shower radiates from one point — random directions read
          as noise. */}
      <div
        className="absolute inset-0"
        style={{ opacity: "clamp(0, calc((var(--storm) - 0.55) * 3.2), 1)" }}
      >
        {Array.from({ length: 12 }, (_, i) => {
          // Steeper than 90deg, so forward is down and to the left.
          const angle = 104 + rand(i + 31) * 22;
          const length = 14 + rand(i + 52) * 22;
          return (
            <div
              key={i}
              className="absolute origin-left"
              style={{
                // Start off the top edge, spread across and beyond the right side so the
                // leftward drift still crosses the whole frame.
                top: `${-14 + rand(i + 40) * 22}%`,
                left: `${10 + rand(i + 47) * 105}%`,
                transform: `rotate(${angle}deg)`,
              }}
            >
              <div
                className="animate-shootingstar"
                style={{
                  width: `${length}vmax`,
                  height: "1px",
                  // Bright at the leading end, fading back into a tail.
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(205,228,250,0.10) 45%, rgba(232,244,255,0.95) 95%, transparent 100%)",
                  animationDuration: `${2.2 + rand(i + 61) * 3.4}s`,
                  animationDelay: `${rand(i + 70) * -7}s`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
