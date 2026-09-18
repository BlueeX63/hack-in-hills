"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

const submissionSchema = z.object({
  teamName: z.string().min(2, "Team name is required"),
  email: z.string().email("Invalid email"),
  githubUrl: z.string().url("Enter a valid GitHub URL"),
  socialUrl: z.union([z.string().url("Enter a valid URL"), z.literal("")]).optional(),
  hostedProjectUrl: z.string().url("Enter a valid project URL"),
  demoVideoUrl: z.string().url("Enter a valid video URL")
});

type SubmissionData = z.infer<typeof submissionSchema>;

export default function SubmitPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, trigger, formState: { errors } } = useForm<SubmissionData>({
    resolver: zodResolver(submissionSchema),
    mode: "onBlur",
    defaultValues: { teamName: "", email: "", githubUrl: "", socialUrl: "", hostedProjectUrl: "", demoVideoUrl: "" }
  });

  const STEPS = [
    { title: "Squad Identity", fields: ["teamName", "email"] as const },
    { title: "Transmission", fields: ["githubUrl", "socialUrl", "hostedProjectUrl", "demoVideoUrl"] as const }
  ];

  const handleNext = async () => {
    const isValid = await trigger([...STEPS[activeStep].fields] as (keyof SubmissionData)[]);
    if (isValid && activeStep < STEPS.length - 1) setActiveStep((prev) => prev + 1);
  };

  const onSubmit = async (data: SubmissionData) => {
    setSubmitError(null);
    setIsSubmitting(true);
    const { error } = await supabase.from("submissions").insert({
      team_name: data.teamName,
      email: data.email,
      github_url: data.githubUrl,
      social_url: data.socialUrl || null,
      hosted_project_url: data.hostedProjectUrl,
      demo_video_url: data.demoVideoUrl
    });
    setIsSubmitting(false);

    if (error) {
      setSubmitError("Transmission failed. Check your connection and try again.");
      return;
    }
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
          Project Submission
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
                    0{index + 1} {"//"} {step.title}
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
                        Who&apos;s transmitting?
                      </h2>
                      <div className="flex flex-col gap-2">
                        <input {...register("teamName")} placeholder="Squad Designation" className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-4 font-sans text-3xl font-light focus:outline-none focus:border-[#1A1A1A] transition-colors cursor-none placeholder-[#1A1A1A]/20" />
                        {errors.teamName && <span className="text-red-500 font-mono text-xs uppercase">{errors.teamName.message}</span>}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-xs tracking-widest uppercase text-[#1A1A1A]/50">Contact Email</label>
                        <input {...register("email")} type="email" placeholder="team@example.com" className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-4 font-sans text-3xl font-light focus:outline-none focus:border-[#1A1A1A] transition-colors cursor-none placeholder-[#1A1A1A]/20" />
                        {errors.email && <span className="text-red-500 font-mono text-xs uppercase">{errors.email.message}</span>}
                      </div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="flex flex-col gap-12">
                      <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                        Send your coordinates.
                      </h2>

                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-xs tracking-widest uppercase text-[#1A1A1A]/50">GitHub Repository</label>
                        <input {...register("githubUrl")} placeholder="https://github.com/your-team/project" className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-4 font-sans text-2xl font-light focus:outline-none focus:border-[#1A1A1A] transition-colors cursor-none placeholder-[#1A1A1A]/20" />
                        {errors.githubUrl && <span className="text-red-500 font-mono text-xs uppercase">{errors.githubUrl.message}</span>}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-xs tracking-widest uppercase text-[#1A1A1A]/50">Social Media <span className="opacity-50 normal-case">(optional)</span></label>
                        <input {...register("socialUrl")} placeholder="https://twitter.com/your-team" className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-4 font-sans text-2xl font-light focus:outline-none focus:border-[#1A1A1A] transition-colors cursor-none placeholder-[#1A1A1A]/20" />
                        {errors.socialUrl && <span className="text-red-500 font-mono text-xs uppercase">{errors.socialUrl.message}</span>}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-xs tracking-widest uppercase text-[#1A1A1A]/50">Hosted Project</label>
                        <input {...register("hostedProjectUrl")} placeholder="https://your-project.vercel.app" className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-4 font-sans text-2xl font-light focus:outline-none focus:border-[#1A1A1A] transition-colors cursor-none placeholder-[#1A1A1A]/20" />
                        {errors.hostedProjectUrl && <span className="text-red-500 font-mono text-xs uppercase">{errors.hostedProjectUrl.message}</span>}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-xs tracking-widest uppercase text-[#1A1A1A]/50">Demo Recording</label>
                        <input {...register("demoVideoUrl")} placeholder="https://youtube.com/watch?v=..." className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-4 font-sans text-2xl font-light focus:outline-none focus:border-[#1A1A1A] transition-colors cursor-none placeholder-[#1A1A1A]/20" />
                        {errors.demoVideoUrl && <span className="text-red-500 font-mono text-xs uppercase">{errors.demoVideoUrl.message}</span>}
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-16 pt-8 border-t border-[#1A1A1A]/10">
                <div>
                  {submitError && <span className="text-red-500 font-mono text-xs uppercase">{submitError}</span>}
                </div>
                <div className="flex gap-4">
                  {activeStep > 0 && (
                    <button type="button" onClick={() => setActiveStep((prev) => prev - 1)} className="font-mono text-sm tracking-widest uppercase font-bold px-8 py-4 border border-[#1A1A1A]/20 hover:border-[#1A1A1A] transition-colors cursor-none">
                      Back
                    </button>
                  )}
                  {activeStep < STEPS.length - 1 ? (
                    <button type="button" onClick={handleNext} className="font-mono text-sm tracking-widest uppercase font-bold px-8 py-4 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F4F1EA] transition-colors cursor-none">
                      Next Step
                    </button>
                  ) : (
                    <button type="submit" disabled={isSubmitting} className="font-mono text-sm tracking-widest uppercase font-bold px-8 py-4 bg-[#1A1A1A] text-[#F4F1EA] hover:bg-[#1A1A1A]/80 transition-colors cursor-none disabled:opacity-50">
                      {isSubmitting ? "Transmitting..." : "Transmit Submission"}
                    </button>
                  )}
                </div>
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
              SIGNAL<br />RECEIVED.
            </h2>
            <p className="font-sans text-xl font-light text-[#1A1A1A]/70 mb-12">
              Your submission has reached base camp. Our judges will review your ascent shortly.
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
