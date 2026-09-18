"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BUDGETS,
  detectTier,
  downgrade,
  readOverride,
  type Budget,
  type PerfTier,
} from "@/lib/performance";

type PerfState = {
  tier: PerfTier;
  budget: Budget;
  reducedMotion: boolean;
  coarsePointer: boolean;
  /**
   * False until detection has run on the client. Decorative effects stay unmounted
   * until then: it keeps the server and first client render identical, and it keeps
   * particles/grain off the critical path.
   */
  resolved: boolean;
};

const INITIAL: PerfState = {
  tier: "low",
  budget: BUDGETS.low,
  reducedMotion: false,
  coarsePointer: false,
  resolved: false,
};

const PerfContext = createContext<PerfState>(INITIAL);

/** How long to watch real frame timing before deciding the machine can't keep up. */
const PROBE_MS = 1500;
const PROBE_START_DELAY_MS = 1200;
/** Deliberately well under 60: a false downgrade costs more than a missed one. */
const MIN_ACCEPTABLE_FPS = 40;
/** Too few frames means the probe was interrupted, not that the device is slow. */
const MIN_PROBE_FRAMES = 30;

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PerfState>(INITIAL);
  const pinned = useRef(false);
  const probed = useRef(false);

  // Pass 1: hardware hints + user preferences, resolved immediately on mount.
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: coarse)");

    const resolve = () => {
      const override = readOverride();
      pinned.current = override !== null;

      const tier = override ?? detectTier();
      setState({
        tier,
        budget: BUDGETS[tier],
        reducedMotion: motionQuery.matches,
        coarsePointer: pointerQuery.matches,
        resolved: true,
      });
    };

    resolve();

    motionQuery.addEventListener("change", resolve);
    pointerQuery.addEventListener("change", resolve);
    return () => {
      motionQuery.removeEventListener("change", resolve);
      pointerQuery.removeEventListener("change", resolve);
    };
  }, []);

  // Pass 2: hardwareConcurrency lies (and is absent in Safari), so measure the frame rate
  // the page is actually achieving and step down once if it is struggling.
  //
  // This deliberately depends only on `resolved`, never on the tier: keying it to the tier
  // made every downgrade re-run the probe, walking a perfectly capable machine all the way
  // down to "low". It also bails whenever the tab is hidden, because requestAnimationFrame
  // is throttled to roughly nothing in background tabs and would read as 2fps.
  useEffect(() => {
    if (!state.resolved || pinned.current || probed.current) return;

    let raf = 0;
    let frames = 0;
    let start = 0;
    let aborted = false;

    const abort = () => {
      aborted = true;
    };

    const tick = (now: number) => {
      if (aborted || document.hidden) return;

      if (!start) {
        start = now;
        raf = requestAnimationFrame(tick);
        return;
      }

      frames += 1;
      const elapsed = now - start;

      if (elapsed < PROBE_MS) {
        raf = requestAnimationFrame(tick);
        return;
      }

      probed.current = true;

      const fps = (frames * 1000) / elapsed;
      if (frames >= MIN_PROBE_FRAMES && fps < MIN_ACCEPTABLE_FPS) {
        setState((prev) => {
          const tier = downgrade(prev.tier);
          return { ...prev, tier, budget: BUDGETS[tier] };
        });
      }
    };

    const timer = window.setTimeout(() => {
      if (document.hidden) return;
      raf = requestAnimationFrame(tick);
    }, PROBE_START_DELAY_MS);

    document.addEventListener("visibilitychange", abort);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", abort);
    };
  }, [state.resolved]);

  // Expose the tier to CSS so purely stylistic fallbacks cost no JS.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.perf = state.tier;
    root.dataset.cursor = state.budget.customCursor ? "custom" : "native";
  }, [state.tier, state.budget.customCursor]);

  const value = useMemo(() => state, [state]);

  return <PerfContext.Provider value={value}>{children}</PerfContext.Provider>;
}

export function usePerformance() {
  return useContext(PerfContext);
}

/** Convenience for the common "render this decorative thing only if we can afford it" check. */
export function useBudget() {
  return useContext(PerfContext).budget;
}
