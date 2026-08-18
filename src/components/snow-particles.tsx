"use client";

import { useEffect, useState } from "react";

export function SnowParticles() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; animationDuration: number; delay: number; size: number }>>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 40; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          animationDuration: Math.random() * 15 + 10, // 10s to 25s
          delay: Math.random() * -20, // Start at different times
          size: Math.random() * 3 + 1, // 1px to 4px
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            top: "-5%",
            animation: `snowfall ${p.animationDuration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes snowfall {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) translateX(20px);
            opacity: 0;
          }
        }
      `}} />
    </div>
  );
}
