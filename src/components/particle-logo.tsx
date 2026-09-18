"use client";

import { useEffect, useRef } from "react";
import { usePerformance } from "@/hooks/use-performance";

type Props = {
  /** Image to reconstruct. Anything with an alpha channel works. */
  src?: string;
  className?: string;
  /** Roughly how many particles to aim for at the top tier. */
  density?: number;
  /**
   * Fractions of the source to discard before sampling, so a lockup can be reduced to
   * just its mark. `{ bottom: 0.42 }` keeps the top 58%.
   */
  crop?: { top?: number; bottom?: number };
  /** Fill colour for the particles. */
  color?: string;
  /** Share of the frame the mark should occupy. */
  fit?: number;
};

type Particle = {
  /** Where this particle belongs in the finished mark. */
  tx: number;
  ty: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  /** Per-particle phase so the idle drift never looks synchronised. */
  phase: number;
  /** Staggers arrival so the mark assembles rather than snapping into place. */
  ease: number;
};

const SAMPLE_SIZE = 190; // resolution the source artwork is sampled at
const ALPHA_CUTOFF = 130;
const POINTER_RADIUS = 92;
const POINTER_FORCE = 2600;

/**
 * The mark, reconstructed out of drifting snow.
 *
 * Particles start scattered outside the frame and settle into the silhouette of the logo,
 * then breathe in place. Moving the cursor through them pushes them out of formation and
 * they find their way back.
 *
 * Implemented on a 2D canvas rather than WebGL: it is one element, one animation loop and
 * no shader compilation, and at these counts the cost is dominated by fill rate either way.
 * The loop stops whenever the hero is off screen or the tab is in the background.
 */
export function ParticleLogo({
  src = "/logo-white.png",
  className,
  density = 1700,
  crop,
  color = "rgba(226,238,250,0.78)",
  fit = 0.72,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { budget, reducedMotion, resolved } = usePerformance();

  // Derived during render and passed through the effect deps, so a tier change rebuilds
  // the field exactly once rather than being read from a ref that React cannot track.
  const targetCount =
    budget.snowParticles === 0
      ? 0 // low tier: no particle field at all
      : budget.snowParticles >= 40
        ? density // high tier: the full mark
        : Math.round(density * 0.4); // medium tier
  const animate = !reducedMotion;
  const cropTop = crop?.top ?? 0;
  const cropBottom = crop?.bottom ?? 0;

  useEffect(() => {
    if (!resolved || targetCount === 0) return;

    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    let width = 0;
    let height = 0;
    let start = 0;

    const pointer = { x: -9999, y: -9999 };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      // Cap DPR: this is soft, low-contrast texture, so extra pixels buy nothing.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /** Sample the artwork's opaque pixels into particle targets. */
    const buildTargets = (image: HTMLImageElement) => {
      // Region of the source to actually sample.
      const srcY = image.height * cropTop;
      const srcH = Math.max(1, image.height * (1 - cropTop - cropBottom));

      const off = document.createElement("canvas");
      const ratio = srcH / image.width;
      off.width = SAMPLE_SIZE;
      off.height = Math.max(1, Math.round(SAMPLE_SIZE * ratio));

      const offCtx = off.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return [];

      offCtx.drawImage(
        image,
        0, srcY, image.width, srcH,
        0, 0, off.width, off.height
      );
      const { data } = offCtx.getImageData(0, 0, off.width, off.height);

      const points: Array<{ x: number; y: number }> = [];
      for (let y = 0; y < off.height; y += 1) {
        for (let x = 0; x < off.width; x += 1) {
          if (data[(y * off.width + x) * 4 + 3] > ALPHA_CUTOFF) {
            points.push({ x, y });
          }
        }
      }

      // Thin evenly down to the budget rather than cropping, so the shape stays complete.
      const stride = Math.max(1, Math.floor(points.length / targetCount));
      const picked = points.filter((_, i) => i % stride === 0);

      // Fit the mark inside the frame, leaving margin.
      // Fit against width: the cropped mark is a wide, short ridge, so keying off the
      // shorter side would shrink it to nothing in a landscape frame.
      const scale = Math.min((width * fit) / off.width, (height * fit) / off.height);
      const offsetX = (width - off.width * scale) / 2;
      const offsetY = (height - off.height * scale) / 2;

      return picked.map<Particle>((p, i) => {
        const angle = (i / picked.length) * Math.PI * 2;
        const radius = Math.max(width, height) * (0.55 + (i % 7) * 0.06);
        return {
          tx: offsetX + p.x * scale,
          ty: offsetY + p.y * scale,
          // Fly in from a ring outside the frame.
          x: width / 2 + Math.cos(angle) * radius,
          y: height / 2 + Math.sin(angle) * radius,
          vx: 0,
          vy: 0,
          size: 0.7 + (i % 5) * 0.22,
          phase: ((i % 97) / 97) * Math.PI * 2,
          ease: 0.035 + ((i % 13) / 13) * 0.045,
        };
      });
    };

    const frame = (now: number) => {
      if (!start) start = now;
      const t = (now - start) / 1000;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        // Breathe around the target so a settled mark still feels alive.
        const driftX = Math.sin(t * 0.7 + p.phase) * 1.6;
        const driftY = Math.cos(t * 0.55 + p.phase) * 1.6;

        let ax = (p.tx + driftX - p.x) * p.ease;
        let ay = (p.ty + driftY - p.y) * p.ease;

        // The cursor parts the mark.
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < POINTER_RADIUS * POINTER_RADIUS) {
          const dist = Math.sqrt(distSq) || 1;
          const force = POINTER_FORCE / (distSq + 120);
          ax += (dx / dist) * force;
          ay += (dy / dist) * force;
        }

        p.vx = (p.vx + ax) * 0.82;
        p.vy = (p.vy + ay) * 0.82;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      if (running) raf = requestAnimationFrame(frame);
    };

    /** Draw the assembled mark once, for reduced-motion users. */
    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;
      for (const p of particles) ctx.fillRect(p.tx, p.ty, p.size, p.size);
    };

    const startLoop = () => {
      if (running || particles.length === 0) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Cached: reading it per pointermove forces a layout recalculation on every event.
    let rect = { left: 0, top: 0 };
    const cacheRect = () => {
      const r = canvas.getBoundingClientRect();
      rect = { left: r.left, top: r.top };
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };

    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const image = new Image();
    image.decoding = "async";

    image.onload = () => {
      resize();
      cacheRect();
      particles = buildTargets(image);
      if (animate) startLoop();
      else drawStatic();
    };

    image.onerror = () => {
      // No artwork, no particles — the hero reads fine without them.
    };

    image.src = src;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!animate) return;
        if (entry.isIntersecting) startLoop();
        else stopLoop();
      },
      { rootMargin: "10% 0px" }
    );
    observer.observe(parent);

    const onVisibility = () => {
      if (!animate) return;
      if (document.hidden) stopLoop();
      else startLoop();
    };

    const onResize = () => {
      resize();
      cacheRect();
      if (particles.length > 0) {
        particles = buildTargets(image);
        if (!animate) drawStatic();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", cacheRect, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", cacheRect);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      image.onload = null;
      image.onerror = null;
    };
  }, [resolved, src, targetCount, animate, cropTop, cropBottom, color, fit]);

  if (!resolved || targetCount === 0) return null;

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
