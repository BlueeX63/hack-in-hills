"use client";

import { motion } from "framer-motion";
import { SnowParticles } from "./snow-particles";

export function Contact() {
  return (
    <section className="relative w-full bg-[#1A1A1A] text-[#F4F1EA] py-32 md:py-48 selection:bg-[#F4F1EA] selection:text-[#1A1A1A] overflow-hidden">
      <SnowParticles />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start gap-24 relative z-10">
        
        {/* Left Side: Massive Typography */}
        <div className="w-full md:w-5/12 flex flex-col">
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#F4F1EA]/40 mb-6">
            [ COMMUNICATIONS ]
          </span>
          <h2 className="font-display text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-12">
            GET IN<br />TOUCH.
          </h2>
          <div className="flex flex-col gap-8">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-[#F4F1EA]/40 uppercase mb-2">Email</div>
              <a href="mailto:hello@hackinhills.com" className="font-sans text-xl md:text-2xl font-light hover:text-[#6B7A75] transition-colors cursor-none">
                hello@hackinhills.com
              </a>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-widest text-[#F4F1EA]/40 uppercase mb-2">Location</div>
              <div className="font-sans text-xl md:text-2xl font-light">
                Base Camp, Manali<br />
                Himachal Pradesh, India
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-widest text-[#F4F1EA]/40 uppercase mb-2">Social</div>
              <div className="flex gap-6">
                <a href="#" className="font-sans text-xl font-light hover:text-[#6B7A75] transition-colors cursor-none">Instagram</a>
                <a href="#" className="font-sans text-xl font-light hover:text-[#6B7A75] transition-colors cursor-none">Twitter (X)</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Brutalist Minimalist Form */}
        <div className="w-full md:w-7/12 flex flex-col">
          <form className="flex flex-col gap-12 w-full max-w-2xl" onSubmit={(e) => e.preventDefault()}>
            
            <div className="relative group cursor-none">
              <input 
                type="text" 
                id="name"
                placeholder=" "
                className="block w-full appearance-none bg-transparent border-0 border-b border-[#F4F1EA]/20 py-4 font-sans text-2xl md:text-3xl font-light text-[#F4F1EA] focus:outline-none focus:ring-0 focus:border-[#F4F1EA] peer transition-colors cursor-none"
              />
              <label 
                htmlFor="name" 
                className="absolute top-4 left-0 pointer-events-none font-mono text-[10px] tracking-widest uppercase text-[#F4F1EA]/40 duration-300 transform -translate-y-8 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 peer-focus:text-[#F4F1EA]"
              >
                What is your name?
              </label>
            </div>

            <div className="relative group cursor-none">
              <input 
                type="email" 
                id="email"
                placeholder=" "
                className="block w-full appearance-none bg-transparent border-0 border-b border-[#F4F1EA]/20 py-4 font-sans text-2xl md:text-3xl font-light text-[#F4F1EA] focus:outline-none focus:ring-0 focus:border-[#F4F1EA] peer transition-colors cursor-none"
              />
              <label 
                htmlFor="email" 
                className="absolute top-4 left-0 pointer-events-none font-mono text-[10px] tracking-widest uppercase text-[#F4F1EA]/40 duration-300 transform -translate-y-8 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 peer-focus:text-[#F4F1EA]"
              >
                What is your email?
              </label>
            </div>

            <div className="relative group cursor-none">
              <textarea 
                id="message"
                placeholder=" "
                rows={3}
                className="block w-full appearance-none bg-transparent border-0 border-b border-[#F4F1EA]/20 py-4 font-sans text-2xl md:text-3xl font-light text-[#F4F1EA] focus:outline-none focus:ring-0 focus:border-[#F4F1EA] peer transition-colors resize-none cursor-none"
              />
              <label 
                htmlFor="message" 
                className="absolute top-4 left-0 pointer-events-none font-mono text-[10px] tracking-widest uppercase text-[#F4F1EA]/40 duration-300 transform -translate-y-8 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 peer-focus:text-[#F4F1EA]"
              >
                How can we help?
              </label>
            </div>

            <div className="pt-8">
              <button className="group relative overflow-hidden font-mono text-sm tracking-[0.2em] uppercase font-bold text-[#1A1A1A] bg-[#F4F1EA] py-6 px-12 rounded-full cursor-none transition-transform hover:scale-105 active:scale-95 duration-500">
                <span className="relative z-10 flex items-center gap-4">
                  Transmit Message
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-500 group-hover:translate-x-1">
                    <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div className="absolute inset-0 bg-[#E6E1D6] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[0.16,1,0.3,1]" />
              </button>
            </div>
            
          </form>
        </div>

      </div>
    </section>
  );
}
