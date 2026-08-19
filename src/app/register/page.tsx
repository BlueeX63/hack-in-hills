"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const registrationSchema = z.object({
  teamName: z.string().min(2, "Team name is required"),
  teamSize: z.coerce.number().min(1, "Min 1").max(4, "Max 4"),
  members: z.array(z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Invalid phone")
  })),
  track: z.string().min(2, "Track is required")
});

export default function RegisterPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { register, handleSubmit, watch, trigger, setValue, formState: { errors } } = useForm<any>({
    resolver: zodResolver(registrationSchema),
    mode: "onBlur",
    defaultValues: { teamSize: 1, members: [{ name: "", email: "", phone: "" }] }
  });

  const teamSize = watch("teamSize") || 1;
  const numMembers = Math.min(Math.max(1, teamSize), 4);
  const selectedTrack = watch("track");

  const STEPS = [
    { title: "Squad Designation", fields: ["teamName", "teamSize"] },
    { title: "Member Profiles", fields: Array.from({ length: numMembers }).flatMap((_, i) => [`members.${i}.name`, `members.${i}.email`, `members.${i}.phone`]) },
    { title: "Expedition Track", fields: ["track"] }
  ];

  const TRACK_OPTIONS = [
    { value: "ai", label: "Artificial Intelligence" },
    { value: "cyber", label: "Cybersecurity" },
    { value: "web3", label: "Web3 & DePIN" },
    { value: "fintech", label: "FinTech" },
    { value: "health", label: "Health-Tech" },
    { value: "climate", label: "Climate-Tech" },
    { value: "edtech", label: "Ed-Tech" },
    { value: "open", label: "Open Innovation" }
  ];

  const handleNext = async () => {
    const isValid = await trigger(STEPS[activeStep].fields as any);
    if (isValid && activeStep < STEPS.length - 1) setActiveStep(prev => prev + 1);
  };

  const onSubmit = (data: any) => {
    console.log("REGISTERED:", data);
    setIsSuccess(true);
  };

  return (
    <main className="relative w-full min-h-screen bg-[#F4F1EA] text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-[#F4F1EA] flex flex-col justify-between">
      
      {/* Header */}
      <header className="w-full px-6 md:px-12 py-8 flex justify-between items-center border-b border-[#1A1A1A]/10">
        <Link href="/" className="font-display font-black text-2xl tracking-tighter uppercase hover:opacity-50 transition-opacity cursor-none">
          Hack in Hills
        </Link>
        <div className="font-mono text-xs tracking-widest uppercase opacity-40">
          Registration
        </div>
      </header>

      {/* Form Content */}
      <div className="flex-grow flex flex-col justify-center items-center px-6 py-24">
        {!isSuccess ? (
          <div className="w-full max-w-3xl">
            
            {/* Step Indicator */}
            <div className="flex gap-4 mb-16">
              {STEPS.map((step, index) => (
                <div key={index} className="flex-1">
                  <div className={`h-[2px] w-full transition-colors duration-500 ${index <= activeStep ? 'bg-[#1A1A1A]' : 'bg-[#1A1A1A]/10'}`} />
                  <div className={`font-mono text-[10px] tracking-widest uppercase mt-4 transition-opacity duration-500 ${index <= activeStep ? 'opacity-100' : 'opacity-30'}`}>
                    0{index + 1} // {step.title}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="min-h-[40vh]"
                >
                  
                  {activeStep === 0 && (
                    <div className="flex flex-col gap-12">
                      <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                        What is your squad called?
                      </h2>
                      <div className="flex flex-col gap-2">
                        <input {...register("teamName")} placeholder="Squad Designation" className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-4 font-sans text-3xl font-light focus:outline-none focus:border-[#1A1A1A] transition-colors cursor-none placeholder-[#1A1A1A]/20" />
                        {errors.teamName && <span className="text-red-500 font-mono text-xs uppercase">{(errors.teamName as any).message}</span>}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-xs tracking-widest uppercase text-[#1A1A1A]/50">Crew Size (1-4)</label>
                        <input {...register("teamSize")} type="number" min="1" max="4" className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-4 font-sans text-3xl font-light focus:outline-none focus:border-[#1A1A1A] transition-colors cursor-none" />
                      </div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="flex flex-col gap-12">
                      <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                        Who is on the team?
                      </h2>
                      <div className="flex flex-col gap-12">
                        {Array.from({ length: numMembers }).map((_, i) => (
                          <div key={i} className="flex flex-col gap-6 p-6 border border-[#1A1A1A]/10 rounded-sm">
                            <div className="font-mono text-[10px] tracking-widest uppercase text-[#1A1A1A]/40">Member 0{i+1}</div>
                            <input {...register(`members.${i}.name`)} placeholder="Full Name" className="w-full bg-transparent border-b border-[#1A1A1A]/20 pb-2 font-sans text-xl font-light focus:outline-none focus:border-[#1A1A1A] transition-colors cursor-none placeholder-[#1A1A1A]/20" />
                            <input {...register(`members.${i}.email`)} placeholder="Email Address" type="email" className="w-full bg-transparent border-b border-[#1A1A1A]/20 pb-2 font-sans text-xl font-light focus:outline-none focus:border-[#1A1A1A] transition-colors cursor-none placeholder-[#1A1A1A]/20" />
                            <input {...register(`members.${i}.phone`)} placeholder="Phone Number" type="tel" className="w-full bg-transparent border-b border-[#1A1A1A]/20 pb-2 font-sans text-xl font-light focus:outline-none focus:border-[#1A1A1A] transition-colors cursor-none placeholder-[#1A1A1A]/20" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="flex flex-col gap-12">
                      <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                        Select your trajectory.
                      </h2>
                      <div className="flex flex-col gap-2">
                        <div className="relative">
                          {/* Hidden input for RHF */}
                          <input type="hidden" {...register("track")} />
                          
                          {/* Custom Select Trigger */}
                          <div 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full flex justify-between items-center border-b border-[#1A1A1A]/20 py-4 cursor-none group"
                          >
                            <span className={`font-sans text-3xl font-light ${!selectedTrack ? 'text-[#1A1A1A]/40' : 'text-[#1A1A1A]'}`}>
                              {selectedTrack ? TRACK_OPTIONS.find(t => t.value === selectedTrack)?.label : "Select a track..."}
                            </span>
                            <motion.svg 
                              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                              width="24" height="24" viewBox="0 0 24 24" fill="none"
                              className="text-[#1A1A1A]/40 group-hover:text-[#1A1A1A] transition-colors"
                            >
                              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </motion.svg>
                          </div>

                          {/* Custom Dropdown Menu */}
                          <AnimatePresence>
                            {isDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 w-full mt-2 bg-[#F4F1EA] border border-[#1A1A1A]/10 shadow-2xl z-50 max-h-[40vh] overflow-y-auto"
                              >
                                {TRACK_OPTIONS.map((opt) => (
                                  <div
                                    key={opt.value}
                                    onClick={() => {
                                      setValue("track", opt.value, { shouldValidate: true });
                                      setIsDropdownOpen(false);
                                    }}
                                    className="px-6 py-4 font-sans text-xl font-light hover:bg-[#1A1A1A] hover:text-[#F4F1EA] transition-colors cursor-none border-b border-[#1A1A1A]/5 last:border-0"
                                  >
                                    {opt.label}
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        {errors.track && <span className="text-red-500 font-mono text-xs uppercase">{(errors.track as any).message}</span>}
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-end mt-16 pt-8 border-t border-[#1A1A1A]/10">
                {activeStep < STEPS.length - 1 ? (
                  <button type="button" onClick={handleNext} className="font-mono text-sm tracking-widest uppercase font-bold px-8 py-4 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F4F1EA] transition-colors cursor-none">
                    Next Step
                  </button>
                ) : (
                  <button type="submit" className="font-mono text-sm tracking-widest uppercase font-bold px-8 py-4 bg-[#1A1A1A] text-[#F4F1EA] hover:bg-[#1A1A1A]/80 transition-colors cursor-none">
                    Authorize & Submit
                  </button>
                )}
              </div>
            </form>

          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center max-w-lg"
          >
            <div className="w-24 h-24 border border-[#1A1A1A]/20 rounded-full flex items-center justify-center mb-12">
              <div className="w-3 h-3 bg-[#1A1A1A] rounded-full" />
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">
              EXPEDITION<br />APPROVED.
            </h2>
            <p className="font-sans text-xl font-light text-[#1A1A1A]/70 mb-12">
              Your squad has been registered. Monitor your communication channels for further instructions.
            </p>
            <Link href="/" className="font-mono text-xs tracking-[0.2em] uppercase font-bold border-b border-[#1A1A1A] pb-1 hover:opacity-50 transition-opacity cursor-none">
              Return to Base
            </Link>
          </motion.div>
        )}
      </div>

    </main>
  );
}
