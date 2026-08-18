"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    // Check if we are on a touch device, if so, don't show the custom cursor
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over clickable element
      const target = e.target as HTMLElement;
      
      // We look for button, a, or any element with cursor: pointer
      const isHoveringInteractive = 
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("button") !== null ||
        target.closest("a") !== null;
        
      setIsPointer(isHoveringInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Inner Precision Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 bg-[#FF512F] rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        animate={{
          x: position.x - 2,
          y: position.y - 2,
          scale: isPointer ? 0 : 1,
          opacity: position.x === -100 ? 0 : 1
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      />
      
      {/* Mountain Expedition Cursor */}
      <motion.div
        className="fixed top-0 left-0 flex flex-col items-center justify-center pointer-events-none z-[9998] mix-blend-difference hidden md:flex"
        animate={{
          x: position.x - 16,
          y: position.y - 16,
          scale: isPointer ? 1.5 : 1,
          opacity: position.x === -100 ? 0 : 1
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
      >
        <motion.svg 
          width="32" 
          height="32" 
          viewBox="0 0 32 32" 
          fill="none" 
          animate={{
            rotate: isPointer ? 180 : 0
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <path d="M16 6 L4 26 L28 26 Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Inner ridges that appear on hover */}
          <motion.path 
            d="M10 16 L16 22 L22 16" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: isPointer ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.svg>
        
        {/* Real-time Coordinate Tracker */}
        <motion.div 
          className="absolute top-10 whitespace-nowrap font-mono text-[9px] tracking-widest text-white/60"
          animate={{ opacity: isPointer ? 0 : 1 }}
        >
          {Math.round(position.x)}°N {Math.round(position.y)}°E
        </motion.div>
      </motion.div>
    </>
  );
}
