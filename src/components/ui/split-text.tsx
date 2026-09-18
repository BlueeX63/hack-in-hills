"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { usePerformance } from "@/hooks/use-performance";
import { cn } from "@/lib/utils";

type Props = {
  children: string;
  className?: string;
  /** "char" rises letter by letter; "word" is calmer and cheaper for long lines. */
  by?: "char" | "word";
  /** Seconds between each unit. */
  stagger?: number;
  delay?: number;
  as?: "span" | "div";
};

/**
 * Masked reveal: each unit sits inside an overflow-hidden box and rises into place.
 *
 * Accessibility — splitting text into per-character spans makes screen readers announce
 * it letter by letter, so the original string is exposed via aria-label and the pieces are
 * hidden from the accessibility tree. Under reduced motion, or on the low tier, the text
 * renders as plain text with no wrappers at all.
 */
export function SplitText({
  children,
  className,
  by = "char",
  stagger = 0.022,
  delay = 0,
  as = "span",
}: Props) {
  const { budget, resolved } = usePerformance();

  const words = useMemo(() => children.split(" "), [children]);

  const Tag = as === "div" ? motion.div : motion.span;
  // An inline-block root sizes to max-content, which stops a long headline from ever
  // wrapping and lets it run past its container. Block roots size to the container.
  const rootLayout = as === "div" ? "block" : "inline-block";

  if (!resolved || !budget.revealAnimations) {
    return <span className={className}>{children}</span>;
  }

  let index = 0;

  return (
    <Tag
      aria-label={children}
      className={cn(rootLayout, className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-12%" }}
    >
      {words.map((word, w) => (
        <span key={`${word}-${w}`} className="inline-block whitespace-nowrap">
          {(by === "char" ? [...word] : [word]).map((unit, u) => {
            const ordinal = index;
            index += 1;
            return (
              // The mask: the child translates from below its own box.
              <span key={`${unit}-${u}`} aria-hidden className="inline-block overflow-hidden align-bottom">
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden: { y: "110%" },
                    visible: { y: "0%" },
                  }}
                  transition={{
                    duration: 0.85,
                    delay: delay + ordinal * stagger,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {unit}
                </motion.span>
              </span>
            );
          })}
          {/* Preserve the space between words without letting it collapse. */}
          {w < words.length - 1 ? <span aria-hidden>&nbsp;</span> : null}
        </span>
      ))}
    </Tag>
  );
}
