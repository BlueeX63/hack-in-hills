"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useLenis } from "lenis/react";

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
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setIsOverHero(latest < window.innerHeight * 0.85);
    if (menuOpen) return;
    setHidden(latest > previous && latest > 160);
  });

  const scrollToSection = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    lenis?.scrollTo(href, {
      offset: -96,
      duration: 1.8,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
  };

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed -top-4 inset-x-0 z-[100] pointer-events-none ${isOverHero ? "" : "mix-blend-difference"}`}
      >
        <div className="flex items-center justify-between px-6 md:px-7  text-[#F4F1EA]">
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
            <button
              onClick={() => setMenuOpen((v) => !v)}
              data-cursor-hover
              aria-label="Toggle menu"
              className="md:hidden flex flex-col items-end gap-[5px] cursor-none"
            >
              <span
                className={`h-[1px] bg-[#F4F1EA] transition-all duration-300 ${menuOpen ? "w-5 rotate-45 translate-y-[3px]" : "w-6"}`}
              />
              <span
                className={`h-[1px] bg-[#F4F1EA] transition-all duration-300 ${menuOpen ? "w-5 -rotate-45 -translate-y-[3px]" : "w-4"}`}
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
            className="fixed inset-0 z-[90] bg-[#1A1A1A] flex flex-col justify-center px-8 md:hidden"
          >
            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-baseline gap-4 text-[#F4F1EA] cursor-none"
                >
                  <span className="font-mono text-xs text-[#F4F1EA]/40">{link.n}</span>
                  <span className="font-display font-bold text-4xl uppercase tracking-tight">
                    {link.label}
                  </span>
                </motion.a>
              ))}
            </nav>

            <div className="absolute bottom-8 left-8 font-mono text-[10px] tracking-widest text-[#F4F1EA]/40 uppercase">
              32.2396°N · Manali
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
