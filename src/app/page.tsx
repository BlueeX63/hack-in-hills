"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader } from "@/components/loader";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { About } from "@/components/about";
import { usePerformance } from "@/hooks/use-performance";

/**
 * Everything below the fold is code-split. These stay server-prerendered (no `ssr: false`)
 * so the markup and SEO are unchanged — only the JS is deferred, which takes a large chunk
 * of parse/compile work off the critical path on a slow CPU.
 */
const Tracks = dynamic(() => import("@/components/tracks").then((m) => m.Tracks));
const Timeline = dynamic(() => import("@/components/timeline").then((m) => m.Timeline));
const PrizePool = dynamic(() => import("@/components/prize-pool").then((m) => m.PrizePool));
const Sponsors = dynamic(() => import("@/components/sponsors").then((m) => m.Sponsors));
const FAQ = dynamic(() => import("@/components/faq").then((m) => m.FAQ));
const Contact = dynamic(() => import("@/components/contact").then((m) => m.Contact));
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer));

export default function Home() {
  const { budget } = usePerformance();
  const [isTearing, setIsTearing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setLoading(false);
    window.scrollTo(0, 0);
  }, []);

  // The focus-pull holds the whole page at opacity 0 behind a 1.5s transition, and a blur
  // forces it all through a filter pass. Worth it on capable hardware; everywhere else the
  // page simply sits behind the loader's own fullscreen overlay, so there is nothing to
  // hide — and no way to get stranded on a blank screen if the transition stalls.
  const entryClass =
    loading && !isTearing && budget.parallax
      ? "scale-[0.8] opacity-0 blur-md translate-y-12"
      : "";

  return (
    <main className="relative flex flex-col min-h-screen text-foreground">
      <Navbar />

      {loading && (
        <Loader
          onComplete={handleLoaderComplete}
          onTearStart={() => setIsTearing(true)}
        />
      )}

      <div
        className={`transition-all duration-[1500ms] ease-[cubic-bezier(0.76,0,0.24,1)] transform-gpu origin-center ${entryClass}`}
      >
        <div className={loading ? "h-screen overflow-hidden pointer-events-none" : ""}>
          <Hero isLoaded={!loading} />
          <About />
          <Tracks />
          <Timeline />
          <PrizePool />
          <Sponsors />
          <FAQ />
          <Contact />
          <Footer />
        </div>
      </div>
    </main>
  );
}
