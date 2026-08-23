"use client";

import { useState, useEffect } from "react";
import { Loader } from "@/components/loader";
import { Hero } from "@/components/hero";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { Navbar } from "@/components/navbar";
import { About } from "@/components/about";

import { Tracks } from "@/components/tracks";
import { Timeline } from "@/components/timeline";
import { PrizePool } from "@/components/prize-pool";
import { Sponsors } from "@/components/sponsors";
import { FAQ } from "@/components/faq";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [isTearing, setIsTearing] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    if (!loading && typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [loading]);

  return (
    <main className="relative flex flex-col min-h-screen  text-foreground transition-colors duration-1000">
      <CustomCursor />
      <Navbar />

      {loading && (
        <Loader 
          onComplete={() => setLoading(false)} 
          onTearStart={() => setIsTearing(true)} 
        />
      )}
      
      {/* 3D Entry Parallax Wrapper */}
      <div 
        className={`transition-all duration-[1500ms] ease-[cubic-bezier(0.76,0,0.24,1)] transform-gpu origin-center ${
          loading && !isTearing 
            ? "scale-[0.8] opacity-0 blur-md translate-y-12" 
            : ""
        }`}
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
