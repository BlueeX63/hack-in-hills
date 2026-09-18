"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useScrollTo } from "@/hooks/use-scroll-to";
import { EVENT } from "@/lib/content";

const NAV_LINKS = [
  { n: "01", label: "HOME", href: "#home" },
  { n: "02", label: "ABOUT", href: "#about" },
  { n: "03", label: "TRACKS", href: "#tracks" },
  { n: "04", label: "TIMELINE", href: "#timeline" },
  { n: "05", label: "PRIZES", href: "#prizes" },
];

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);
  const { scrollY } = useScroll();
  const scrollTo = useScrollTo();

  // Cached so the scroll handler never reads layout on a scroll frame.
  const heroHeight = useRef(0);
  useEffect(() => {
    const measure = () => {
      heroHeight.current = window.innerHeight * 0.85;
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setIsOverHero(latest < heroHeight.current);
    if (menuOpen) return;
    setHidden(latest > previous && latest > 160);
  });

  // An open fullscreen menu should not have the page scrolling behind it, and Escape
  // should close it.
  useEffect(() => {
    if (!menuOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const scrollToSection = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollTo(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        // On phones the bar sits flush at the top (and clears the notch); the -16px lift is
        // a desktop composition choice that pushed the controls off a small screen.
        className={`fixed top-0 md:-top-4 inset-x-0 z-[100] pointer-events-none pt-[env(safe-area-inset-top)] md:pt-0 ${isOverHero ? "" : "mix-blend-difference"}`}
      >
        <div className="flex items-center justify-between px-4 md:px-7 text-[#F4F1EA]">
          {/* Left: Logo / Identity */}
          <Link
            href="#home"
            data-cursor-hover
            onClick={(e) => scrollToSection(e, "#home")}
            className="flex items-center gap-3 pointer-events-auto cursor-none group"
          >
            <Image
              src="/logo-white.png"
              alt="Hack in Hills"
              width={120}
              height={120}
              draggable={false}
              className="w-10 h-10 md:w-25 md:h-25 object-contain select-none"
              priority
            />
           
          </Link>

          {/* Center: Expedition Nav */}
          <nav className="hidden md:flex items-center gap-8 pointer-events-auto">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-cursor-hover
                onClick={(e) => scrollToSection(e, link.href)}
                className="group flex items-center gap-1.5 font-mono text-[15px] font-bold tracking-[0.2em] uppercase text-white hover:text-[#F4F1EA] transition-colors cursor-none"
              >
        
                <span className="relative">
                  {link.label}
                  <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[#F4F1EA] transition-all duration-300 group-hover:w-full" />
                </span>
              </a>
            ))}
          </nav>

          {/* Right: Mobile Toggle */}
          <div className="flex items-center gap-6 pointer-events-auto">
            {/* 44px tap target with the bars centred inside it. The old control was two
                1px rules in a 24x7px box — under half the minimum touch size, and almost
                invisible over the hero photograph. */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              data-cursor-hover
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="md:hidden relative -mr-2 h-11 w-11 flex flex-col items-center justify-center gap-[6px] cursor-none"
            >
              <span
                className={`block h-[2px] bg-[#F4F1EA] rounded-full transition-all duration-300 ${
                  menuOpen ? "w-6 rotate-45 translate-y-[4px]" : "w-6"
                }`}
              />
              <span
                className={`block h-[2px] bg-[#F4F1EA] rounded-full transition-all duration-300 ${
                  menuOpen ? "w-6 -rotate-45 -translate-y-[4px]" : "w-4 self-end mr-[10px]"
                }`}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[90] bg-[#1A1A1A] flex flex-col justify-center px-8 pt-24 pb-28 md:hidden overflow-y-auto"
          >
            <nav className="flex flex-col gap-5">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  // py-1 keeps each row a comfortable tap target without changing the rhythm.
                  className="flex items-baseline gap-4 py-1 text-[#F4F1EA]"
                >
                  <span className="font-mono text-xs text-[#F4F1EA]/40">{link.n}</span>
                  <span className="font-display font-bold text-4xl uppercase tracking-tight">
                    {link.label}
                  </span>
                </motion.a>
              ))}
            </nav>

            {/* The primary action was missing from the mobile nav entirely — it only
                existed as the tag in the hero. */}
            <motion.a
              href={EVENT.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + NAV_LINKS.length * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 inline-flex items-center justify-between gap-4 w-full border border-[#F4F1EA]/25 px-6 py-5 font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#F4F1EA]"
            >
              Register
              <span aria-hidden>→</span>
            </motion.a>

            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between font-mono text-[10px] tracking-widest text-[#F4F1EA]/40 uppercase">
              <span>32.2396°N · Manali</span>
              <span>{EVENT.dateLine}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
