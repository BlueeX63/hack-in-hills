"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Sponsor = {
  id: string;
  name: string;
  logo: string;
  /** Some logos ship on a dark/branded background; render those on a dark tile so they don't look clipped. */
  dark?: boolean;
};

const SPONSORS: Sponsor[] = [
  { id: "binance", name: "Binance", logo: "/sponsors/binance.png",  },
  { id: "shardeum", name: "Shardeum", logo: "/sponsors/shardeum.png" ,  },
  { id: "mexc", name: "MEXC", logo: "/sponsors/mexc.png",  },
  { id: "coindcx", name: "CoinDCX", logo: "/sponsors/coindcx.png", },
  { id: "metamask", name: "MetaMask", logo: "/sponsors/metamask.png",},
  {id: "hackquests", name: "HackQuests", logo: "/sponsors/hackquest.png",},
  { id: "kanthariya", name: "Kanthariya Technologies", logo: "/sponsors/kanthariya-technologies.png",},
  { id: "pbw", name: "Philippine Blockchain Week", logo: "/sponsors/philippine-blockchain-week.png", },
  { id: "idgs", name: "Indian Digital Gaming Society", logo: "/sponsors/idgs.png", },
    { id: "trae", name: "TRAE", logo: "/sponsors/trae.png", },
    {id:"thore", name: "Thore", logo: "/sponsors/thore.png", },
    {id:"miro", name: "Miro", logo: "/sponsors/miro.png", },
    {id:"moveo", name: "Move", logo: "/sponsors/move.png", },
    {id:"claude", name: "Claude", logo: "/sponsors/claude.png", },
    {id:"sentient", name: "Sentient", logo: "/sponsors/sentient.png", },
    {id:"metaspace", name: "Metaspace", logo: "/sponsors/metaspace.png", },
    {id:"redbull", name: "Red Bull", logo: "/sponsors/redbull.png", },
    {id:"payzolla", name: "Payzolla", logo: "/sponsors/payzoll.png", },
];

export function Sponsors() {
  return (
    <section
      id="sponsors"
      className="relative w-full bg-[#E6E1D6] text-[#1A1A1A] py-32 md:py-48 selection:bg-[#1A1A1A] selection:text-[#E6E1D6]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 md:mb-32">
          <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter">
            THE SPONSORS
          </h2>
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-[#1A1A1A]/50 mt-4 md:mt-0">
            Previous sponsors & partners.
          </div>
        </div>

        {/* Logo Wall */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 border-t border-l border-[#1A1A1A]/10">
          {SPONSORS.map((sponsor, index) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
              className={`group flex items-center justify-center aspect-square border-r border-b border-[#1A1A1A]/10 p-10 md:p-12 cursor-none relative overflow-hidden ${
                sponsor.dark ? "bg-[#1A1A1A]" : ""
              }`}
            >
              {/* Subtle hover brackets */}
              <div className={`absolute top-6 left-6 w-4 h-4 border-t border-l opacity-0 group-hover:opacity-30 transition-all duration-500 -translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 ${sponsor.dark ? "border-[#F4F1EA]" : "border-[#1A1A1A]"}`} />
              <div className={`absolute top-6 right-6 w-4 h-4 border-t border-r opacity-0 group-hover:opacity-30 transition-all duration-500 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 ${sponsor.dark ? "border-[#F4F1EA]" : "border-[#1A1A1A]"}`} />
              <div className={`absolute bottom-6 left-6 w-4 h-4 border-b border-l opacity-0 group-hover:opacity-30 transition-all duration-500 -translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 ${sponsor.dark ? "border-[#F4F1EA]" : "border-[#1A1A1A]"}`} />
              <div className={`absolute bottom-6 right-6 w-4 h-4 border-b border-r opacity-0 group-hover:opacity-30 transition-all duration-500 translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 ${sponsor.dark ? "border-[#F4F1EA]" : "border-[#1A1A1A]"}`} />

              <div className="relative w-full h-14 md:h-16 lg:h-30 z-10 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105">
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-contain"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
