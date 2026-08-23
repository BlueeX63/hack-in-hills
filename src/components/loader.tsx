"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


const tearPoints = "50% 0%, 58% 12%, 42% 18%, 56% 35%, 45% 42%, 55% 60%, 42% 70%, 58% 85%, 50% 100%";
const leftClip = `polygon(0 0, ${tearPoints}, 0 100%)`;
const rightClip = `polygon(100% 0, ${tearPoints}, 100% 100%)`;
const loaderImage = "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=2500";



export function Loader({ onComplete, onTearStart }: { onComplete: () => void, onTearStart?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"loading" | "tearing" | "exit">("loading");

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 6) + 1;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        
        setTimeout(() => {
          setStage("tearing");
          if (onTearStart) onTearStart();
          
          setTimeout(() => {
            setStage("exit");
            onComplete();
          }, 1500); 
        }, 500);
      }
      
      setProgress(currentProgress);
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete, onTearStart]);

  const tearPoints = "50% 0%, 58% 12%, 42% 18%, 56% 35%, 45% 42%, 55% 60%, 42% 70%, 58% 85%, 50% 100%";
  
  const shakeAnimation: any = {
    x: "0px",
    y: "0px",
    transition: { duration: 0.2, ease: "linear" }
  };

  return (
    <AnimatePresence>
      {stage !== "exit" && (
        <motion.div
          className="fixed inset-0 z-[999] bg-transparent pointer-events-none"
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <motion.div 
            className="absolute top-[-10vh] bottom-[-10vh] left-[-10vw] right-[-10vw] origin-center"
            initial={{ scale: 1 }}
            animate={{ 
              scale: stage === "tearing" ? 10 : 1, 
              opacity: 1 
            }}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }} 
          >
            
            <motion.div className="absolute inset-0 w-full h-full" animate={shakeAnimation}>
              
              
              <motion.div
                className="absolute inset-0 w-full h-full flex items-center justify-center origin-left"
                initial={{ x: 0, rotateY: 0 }}
                animate={{ x: stage === "loading" ? "-1vw" : "-30vw" }}
                transition={
                  stage === "loading" 
                    ? { duration: 15, ease: "linear" } 
                    : { duration: 1.5, ease: [0.76, 0, 0.24, 1] }
                }
                style={{
                  clipPath: leftClip,
                  filter: "drop-shadow(20px 0px 40px rgba(0,0,0,0.9))"
                }}
              >
                <div className="absolute inset-0 bg-[#000000]">
                  <img 
                    src={loaderImage} 
                    alt="Left"
                    className="absolute inset-0 w-full h-full object-cover object-center saturate-50 brightness-75 contrast-125"
                  />
                  <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
                  
                  
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="font-sans font-light text-[5vw] tracking-[0.3em] text-white/90 whitespace-nowrap">
                      HACK IN HILLS
                    </div>
                  </div>
                </div>
              </motion.div>

              
              <motion.div
                className="absolute inset-0 w-full h-full flex items-center justify-center origin-right"
                initial={{ x: 0, rotateY: 0 }}
                
                animate={{ x: stage === "loading" ? "1vw" : "30vw" }}
                transition={
                  stage === "loading" 
                    ? { duration: 15, ease: "linear" } 
                    : { duration: 1.5, ease: [0.76, 0, 0.24, 1] }
                }
                style={{
                  clipPath: rightClip,
                  filter: "drop-shadow(-20px 0px 40px rgba(0,0,0,0.9))"
                }}
              >
                <div className="absolute inset-0 bg-[#000000]">
                  <img 
                    src={loaderImage} 
                    alt="Right"
                    className="absolute inset-0 w-full h-full object-cover object-center saturate-50 brightness-75 contrast-125 scale-105"
                  />
                  <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
                  
                  
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="font-sans font-light text-[5vw] tracking-[0.3em] text-white/90 whitespace-nowrap">
                      HACK IN HILLS
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>



          
          <div className="absolute inset-0 z-30 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

          
          <motion.div 
            className="absolute bottom-12 right-12 z-40 pointer-events-none mix-blend-difference flex flex-col items-end"
            animate={{ 
              opacity: stage === "tearing" ? 0 : 1,
              scale: stage === "tearing" ? 1.5 : 1
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="font-mono text-6xl font-bold text-white tracking-tighter">
              {progress}<span className="text-2xl text-accent">%</span>
            </div>
            <div className="font-mono text-xs tracking-[0.5em] text-white/50 uppercase mt-2">
              System Initialization
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
