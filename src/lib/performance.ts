/**
 * Device capability detection.
 *
 * The site is art-directed for a capable desktop GPU, but it has to stay usable
 * on integrated graphics and 4GB laptops. Rather than sprinkling `if (isMobile)`
 * checks around, every expensive effect reads a single tier from here.
 *
 *   high   — full art direction: snow, grain, parallax, smooth scroll, cursor
 *   medium — reduced particle counts, no blend modes, lighter smooth scroll
 *   low    — static composition: no particles, no grain, native scroll, no cursor
 */

export type PerfTier = "low" | "medium" | "high";

export type Capabilities = {
  tier: PerfTier;
  /** User asked the OS to minimise animation. Overrides everything. */
  reducedMotion: boolean;
  /** Touch / stylus — no hover, so no custom cursor and no hover-only affordances. */
  coarsePointer: boolean;
};

/** Effects budget derived from the tier, so components never branch on the tier directly. */
export type Budget = {
  snowParticles: number;
  filmGrain: boolean;
  /** Scroll-linked parallax (useScroll/useTransform on position). */
  parallax: boolean;
  /** mix-blend-mode / backdrop-filter, which force compositor read-back. */
  blendModes: boolean;
  customCursor: boolean;
  /** Lenis smooth scrolling. `null` means use the browser's native scroll. */
  smoothScrollLerp: number | null;
  /** Entrance/reveal animations. Off under reduced-motion. */
  revealAnimations: boolean;
};

export const BUDGETS: Record<PerfTier, Budget> = {
  high: {
    snowParticles: 40,
    filmGrain: true,
    parallax: true,
    blendModes: true,
    customCursor: true,
    smoothScrollLerp: 0.1,
    revealAnimations: true,
  },
  medium: {
    snowParticles: 14,
    filmGrain: true,
    parallax: true,
    blendModes: false,
    // Cheap enough to keep: position lives in motion values and hover state comes from
    // event delegation, so it costs no per-frame React work. Only the low tier drops it.
    customCursor: true,
    smoothScrollLerp: 0.2,
    revealAnimations: true,
  },
  low: {
    snowParticles: 0,
    filmGrain: false,
    parallax: false,
    blendModes: false,
    customCursor: false,
    smoothScrollLerp: null,
    revealAnimations: false,
  },
};

const TIER_ORDER: PerfTier[] = ["low", "medium", "high"];

export function downgrade(tier: PerfTier): PerfTier {
  return TIER_ORDER[Math.max(0, TIER_ORDER.indexOf(tier) - 1)];
}

export function isTier(value: unknown): value is PerfTier {
  return value === "low" || value === "medium" || value === "high";
}

const OVERRIDE_KEY = "hih:perf-tier";

/**
 * Manual escape hatch: `?perf=low` pins the tier and remembers it, so someone on a
 * slow machine can force the light build without us having to guess right.
 * `?perf=auto` clears it.
 */
export function readOverride(): PerfTier | null {
  if (typeof window === "undefined") return null;

  try {
    const fromUrl = new URLSearchParams(window.location.search).get("perf");
    if (fromUrl === "auto") {
      window.localStorage.removeItem(OVERRIDE_KEY);
      return null;
    }
    if (isTier(fromUrl)) {
      window.localStorage.setItem(OVERRIDE_KEY, fromUrl);
      return fromUrl;
    }
    const stored = window.localStorage.getItem(OVERRIDE_KEY);
    return isTier(stored) ? stored : null;
  } catch {
    // Private mode / storage disabled — fall back to detection.
    return null;
  }
}

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/**
 * Static guess from the hardware hints the browser exposes. These are coarse and
 * often absent, so `usePerformance` refines the result with a live FPS probe.
 */
export function detectTier(): PerfTier {
  if (typeof window === "undefined") return "high";

  const nav = navigator as NavigatorWithHints;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "low";
  if (nav.connection?.saveData) return "low";

  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;

  if (cores <= 2 || memory <= 2) return "low";

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (cores <= 4 || memory <= 4 || coarse) return "medium";

  return "high";
}
