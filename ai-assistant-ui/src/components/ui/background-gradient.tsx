import * as React from "react";
import { cn } from "@/utils/cn";

interface BackgroundGradientProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}

export function BackgroundGradient({
  children,
  className,
  containerClassName,
  animate = true,
}: BackgroundGradientProps) {
  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <div
        className={cn(
          "absolute inset-0 z-0 opacity-60 blur-[80px] saturate-150",
          animate && "animate-pulse-slow",
          className
        )}
        style={{
          background:
            "linear-gradient(120deg, rgba(var(--primary-300), 0.4), rgba(var(--primary-600), 0.2), rgba(var(--primary-200), 0.3))",
          clipPath:
            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface GlowingBorderProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowingBorder({
  children,
  className,
  glowColor = "rgba(var(--primary-500), 0.5)",
}: GlowingBorderProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden border border-white/10",
        className
      )}
    >
      <div
        className="absolute inset-0 z-0 border-glow blur-sm"
        style={{
          background: `radial-gradient(circle at top left, ${glowColor}, transparent 65%)`,
        }}
      ></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
} 