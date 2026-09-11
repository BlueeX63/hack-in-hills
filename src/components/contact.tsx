"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { SnowParticles } from "./snow-particles";
import { supabase } from "@/lib/supabase";

const contactSchema = z.object({
  name: z.string().min(2, "Tell us your name"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(5, "Message is too short"),
});

type ContactData = z.infer<typeof contactSchema>;

export function Contact() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (data: ContactData) => {
    setSubmitError(null);
    setIsSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      message: data.message,
    });
    setIsSubmitting(false);

    if (error) {
      setSubmitError("Transmission failed. Check your connection and try again.");
      return;
    }
    setIsSuccess(true);
    reset();
  };

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
              <div className="flex flex-wrap gap-4 md:gap-6">
                <a href="https://www.instagram.com/hackinhills" target="_blank" rel="noopener noreferrer" className="font-sans text-lg md:text-xl font-light hover:text-[#6B7A75] transition-colors cursor-none">Instagram</a>
                <a href="https://x.com/web3indiahq?s=11" target="_blank" rel="noopener noreferrer" className="font-sans text-lg md:text-xl font-light hover:text-[#6B7A75] transition-colors cursor-none">Twitter (X)</a>
                <a href="https://www.linkedin.com/company/hack-in-hills/" target="_blank" rel="noopener noreferrer" className="font-sans text-lg md:text-xl font-light hover:text-[#6B7A75] transition-colors cursor-none">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Brutalist Minimalist Form */}
        <div className="w-full md:w-7/12 flex flex-col">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-6 max-w-2xl"
              >
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#F4F1EA]/40">
                  [ SIGNAL RECEIVED ]
                </span>
                <h3 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9]">
                  Message sent.
                </h3>
                <p className="font-sans text-lg md:text-xl font-light text-[#F4F1EA]/70">
                  We&apos;ll get back to you from base camp shortly.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="w-fit font-mono text-xs tracking-[0.2em] uppercase font-bold border-b border-[#F4F1EA] pb-1 hover:opacity-50 transition-opacity cursor-none mt-4"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-12 w-full max-w-2xl"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="relative group cursor-none">
                  <input
                    {...register("name")}
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
                  {errors.name && (
                    <span className="block mt-2 font-mono text-[10px] tracking-widest uppercase text-[#E8735C]">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                <div className="relative group cursor-none">
                  <input
                    {...register("email")}
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
                  {errors.email && (
                    <span className="block mt-2 font-mono text-[10px] tracking-widest uppercase text-[#E8735C]">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div className="relative group cursor-none">
                  <textarea
                    {...register("message")}
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
                  {errors.message && (
                    <span className="block mt-2 font-mono text-[10px] tracking-widest uppercase text-[#E8735C]">
                      {errors.message.message}
                    </span>
                  )}
                </div>

                <div className="pt-8 flex items-center gap-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative overflow-hidden font-mono text-sm tracking-[0.2em] uppercase font-bold text-[#1A1A1A] bg-[#F4F1EA] py-6 px-12 rounded-full cursor-none transition-transform hover:scale-105 active:scale-95 duration-500 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <span className="relative z-10 flex items-center gap-4">
                      {isSubmitting ? "Transmitting..." : "Transmit Message"}
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-500 group-hover:translate-x-1">
                        <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-[#E6E1D6] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                  </button>
                  {submitError && (
                    <span className="font-mono text-[10px] tracking-widest uppercase text-[#E8735C]">
                      {submitError}
                    </span>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
