"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface DisplayTypographyProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  variant?: "default" | "outline" | "masked" | "blend";
  size?: "massive" | "huge" | "large" | "medium";
  maskImage?: string; // URL for the image if using masked variant
}

export function DisplayTypography({
  children,
  as: Component = "h1",
  variant = "default",
  size = "massive",
  maskImage,
  className,
  ...props
}: DisplayTypographyProps) {
  const sizeClasses = {
    massive: "text-[15vw] leading-[0.8] tracking-[0.02em]",
    huge: "text-[10vw] leading-[0.85] tracking-[0.02em]",
    large: "text-6xl md:text-8xl lg:text-9xl leading-none tracking-normal",
    medium: "text-4xl md:text-6xl lg:text-7xl leading-tight",
  };

  const variantClasses = {
    default: "text-foreground",
    outline: "text-transparent [-webkit-text-stroke:2px_var(--color-foreground)]",
    masked: "text-transparent bg-clip-text bg-cover bg-center",
    blend: "mix-blend-overlay text-ice opacity-90", // or mix-blend-difference
  };

  return (
    <Component
      className={cn(
        "font-anton uppercase",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      style={
        variant === "masked" && maskImage
          ? { backgroundImage: `url(${maskImage})` }
          : undefined
      }
      {...props}
    >
      {children}
    </Component>
  );
}
