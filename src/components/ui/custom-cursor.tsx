"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { usePerformance } from "@/hooks/use-performance";

/**
 * The expedition cursor: a summit flag, trailing kicked-up snow.
 *
 * At rest it is a small pennant on a pole with a few flakes lagging behind it. Move over a
 * card and the flag plants — the pole drives down, the pennant unfurls and snaps out, and
 * the card's own word appears beside it on a marker line. Click and it drives in harder.
 *
 * Cards shape it through data attributes, so nothing needs to know how it is drawn:
 *
 *   data-cursor="peak | view | expand | link"   which mode to take
 *   data-cursor-text="EXPLORE"                  word on the marker
 *   data-cursor-alt="2,300M"                    elevation under it
 *
 * Anything interactive without them still gets `link`, so plain anchors stay covered.
 *
 * Perf — position lives in motion values, so pointer movement never triggers a React
 * render, and the snow trail is built from springs chained off those same values rather
 * than a per-frame loop of our own. Off on touch, and off entirely on the low tier.
 */

type Mode = "idle" | "link" | "expand" | "peak" | "view";

const TARGET_SELECTOR =
  "a, button, [role='button'], input, textarea, select, [data-cursor], [data-cursor-text], [data-cursor-hover]";

/** How far the pennant is unfurled, and how big the flag rides, per mode. */
const MODES: Record<Mode, { scale: number; furl: number }> = {
  idle: { scale: 1, furl: 0.18 },
  link: { scale: 1.35, furl: 0.62 },
  expand: { scale: 1.5, furl: 0.8 },
  peak: { scale: 1.75, furl: 1 },
  view: { scale: 1.85, furl: 1 },
};

const TRAIL = [0, 1, 2, 3, 4];

type Surface = "light" | "dark";

/** Snow on dark surfaces, ink on light ones. Each carries the other as its rim. */
const PALETTE: Record<Surface, { body: string; rim: string; text: string; shadow: string }> = {
  dark: {
    body: "#F4F1EA",
    rim: "rgba(9,17,27,0.55)",
    text: "#F4F1EA",
    shadow: "0 1px 4px rgba(0,0,0,0.85)",
  },
  light: {
    body: "#12202F",
    rim: "rgba(244,241,234,0.8)",
    text: "#12202F",
    shadow: "0 1px 4px rgba(255,255,255,0.9)",
  },
};

/**
 * Which kind of surface the cursor is sitting on.
 *
 * This replaced `mix-blend-difference`: differencing white against a mid-tone backdrop
 * returns a mid-tone, so the flag washed out over the hero photograph and the atmosphere's
 * vignette. Reading the nearest painted background instead lets the cursor flip between
 * snow and ink per section and keeps full contrast over photography.
 */
function surfaceAt(el: Element | null): Surface {
  let node: Element | null = el;

  while (node && node !== document.documentElement) {
    const bg = getComputedStyle(node).backgroundColor;
    const parts = bg.match(/rgba?\(([^)]+)\)/);

    if (parts) {
      const [r, g, b, a = 1] = parts[1].split(",").map((v) => Number(v.trim()));
      if (a > 0.5) {
        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        return luminance > 0.5 ? "light" : "dark";
      }
    }

    node = node.parentElement;
  }

  // The page sits on a dark shell by default.
  return "dark";
}

/** One lagging flake of kicked-up snow. Softer spring the further back it sits. */
function TrailFlake({
  x,
  y,
  index,
  body,
  rim,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  index: number;
  body: string;
  rim: string;
}) {
  const sx = useSpring(x, {
    stiffness: 240 - index * 38,
    damping: 22 + index * 3,
    mass: 0.4 + index * 0.16,
  });
  const sy = useSpring(y, {
    stiffness: 240 - index * 38,
    damping: 22 + index * 3,
    mass: 0.4 + index * 0.16,
  });

  const size = 5 - index * 0.7;

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none"
      style={{
        x: sx,
        y: sy,
        width: size,
        height: size,
        translateX: "-50%",
        translateY: "-50%",
        // Opaque and softly shadowed — a half-transparent flake vanishes over mid-tones,
        // and a hard rim on a 5px dot reads as a bubble rather than snow.
        opacity: 0.9 - index * 0.14,
        background: body,
        boxShadow: `0 1px 3px ${rim}`,
      }}
    />
  );
}

export function CustomCursor() {
  const { budget, coarsePointer, resolved } = usePerformance();
  const enabled = resolved && budget.customCursor && !coarsePointer;

  const [mode, setMode] = useState<Mode>("idle");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [planted, setPlanted] = useState(false);
  const [surface, setSurface] = useState<Surface>("dark");

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const flagX = useSpring(x, { damping: 26, stiffness: 420, mass: 0.28 });
  const flagY = useSpring(y, { damping: 26, stiffness: 420, mass: 0.28 });

  const visibleRef = useRef(false);
  const readoutRef = useRef<HTMLDivElement>(null);
  // Written straight to the DOM so the readout never re-subscribes the listeners and never
  // races React over the same text node.
  const altitudeRef = useRef("");

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    let pending: { x: number; y: number } | null = null;

    const flush = () => {
      frame = 0;
      if (!pending) return;
      x.set(pending.x);
      y.set(pending.y);
      pending = null;
    };

    // Last known pointer position, so a scroll can re-test what is now underneath.
    const at = { x: -200, y: -200 };

    const onMove = (e: MouseEvent) => {
      at.x = e.clientX;
      at.y = e.clientY;
      pending = { x: e.clientX, y: e.clientY };
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
      if (!frame) frame = requestAnimationFrame(flush);
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.(
        TARGET_SELECTOR
      ) as HTMLElement | null;

      if (!target) {
        setMode("idle");
        setLabel("");
        altitudeRef.current = "";
        setSurface(surfaceAt(e.target as Element | null));
        return;
      }

      setSurface(surfaceAt(target));

      const declared = target.getAttribute("data-cursor") as Mode | null;
      const text = target.getAttribute("data-cursor-text") ?? "";

      setMode(declared && declared in MODES ? declared : text ? "peak" : "link");
      setLabel(text);
      altitudeRef.current = target.getAttribute("data-cursor-alt") ?? "";
    };

    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    const onDown = () => setPlanted(true);
    const onUp = () => setPlanted(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    let surfaceFrame = 0;
    const onScroll = () => {
      if (surfaceFrame) return;
      surfaceFrame = requestAnimationFrame(() => {
        surfaceFrame = 0;
        setSurface(surfaceAt(document.elementFromPoint(at.x, at.y)));
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);

    // Text cannot live in a motion value; sampling on a timer keeps it off the frame path.
    const timer = window.setInterval(() => {
      const node = readoutRef.current;
      if (!node) return;
      const next = altitudeRef.current;
      if (node.textContent !== next) node.textContent = next;
    }, 120);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("scroll", onScroll);
      if (surfaceFrame) cancelAnimationFrame(surfaceFrame);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      window.clearInterval(timer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled, x, y]);

  // Hide the native pointer only once ours is on screen, so a cursor that failed to mount
  // never leaves the page with no pointer at all.
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("cursor-hidden");
    return () => document.documentElement.classList.remove("cursor-hidden");
  }, [enabled]);

  if (!enabled) return null;

  const spec = MODES[mode];
  const engaged = mode !== "idle";
  const skin = PALETTE[surface];

  return (
    <div className="hidden md:block">
      {/* Kicked-up snow, lagging behind the flag. */}
      <div className="fixed inset-0 pointer-events-none z-[9997]">
        {TRAIL.map((i) => (
          <TrailFlake key={i} x={x} y={y} index={i} body={skin.body} rim={skin.rim} />
        ))}
      </div>

      {/* The flag itself. */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: flagX, y: flagY }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.18 }}
      >
        <motion.div
          className="relative"
          animate={{ scale: spec.scale * (planted ? 0.86 : 1) }}
          transition={{ type: "spring", stiffness: 380, damping: 22, mass: 0.4 }}
          style={{ transformOrigin: "0px 22px" }}
        >
          <svg
            width="34"
            height="30"
            viewBox="0 0 34 30"
            fill="none"
            className="overflow-visible"
            // The pole's foot sits on the true pointer position.
            style={{ transform: "translate(-1px, -22px)" }}
          >
            {/* Pole. Drawn twice: a dark backing stroke, then the white pole over it, so
                it stays visible against any surface without a blend mode. */}
            <line
              x1="1.5"
              y1="0"
              x2="1.5"
              y2="22"
              stroke={skin.rim}
              strokeWidth="3.6"
              strokeLinecap="round"
            />
            <line
              x1="1.5"
              y1="0"
              x2="1.5"
              y2="22"
              stroke={skin.body}
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Pennant, unfurling and fluttering as it engages. */}
            <motion.path
              fill={skin.body}
              stroke={skin.rim}
              strokeWidth="1.6"
              strokeLinejoin="round"
              initial={false}
              animate={{
                d:
                  spec.furl > 0.7
                    ? "M2.5,1 L26,6.5 L2.5,13 Z"
                    : spec.furl > 0.4
                      ? "M2.5,1 L17,5.5 L2.5,11 Z"
                      : "M2.5,1 L8,3.5 L2.5,7.5 Z",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            />

            {/* A second, lighter pennant edge gives the flag some snap in the wind. */}
            <motion.path
              fill={skin.rim}
              initial={false}
              animate={{
                opacity: spec.furl > 0.7 ? 0.5 : 0,
                d:
                  spec.furl > 0.7
                    ? "M2.5,13 L20,9 L18,12 L2.5,15 Z"
                    : "M2.5,11 L14,7 L13,9 L2.5,12 Z",
              }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
            />

            {/* Snow piling at the base once the flag is planted. */}
            <motion.path
              d="M-5,22 L-2,18.5 L1.5,21 L5,17.5 L9,22 Z"
              fill={skin.body}
              stroke={skin.rim}
              strokeWidth="1.2"
              strokeLinejoin="round"
              initial={false}
              animate={{ opacity: engaged ? 0.95 : 0, y: engaged ? 0 : 3 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </motion.div>

        {/* Marker, deliberately outside the scaled wrapper so the type stays one size
            whatever the flag is doing. Its offset tracks the pennant's scaled width. */}
        <motion.div
          className="absolute flex flex-col gap-[3px] whitespace-nowrap"
          style={{ top: -14 }}
          initial={false}
          animate={{
            opacity: label ? 1 : 0,
            x: 26 * spec.scale + (label ? 12 : 4),
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className="font-mono text-[10px] font-bold tracking-[0.16em] uppercase leading-none"
            style={{ color: skin.text, textShadow: skin.shadow }}
          >
            {label}
          </span>
          <span className="h-px w-full" style={{ background: skin.body, opacity: 0.7 }} />
          <div
            ref={readoutRef}
            className="font-mono text-[8px] tracking-[0.2em] uppercase leading-none"
            style={{ color: skin.text, opacity: 0.8, textShadow: skin.shadow }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CustomCursor;
