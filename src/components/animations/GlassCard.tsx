"use client";

import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { useRef, useCallback } from "react";

export default function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const bg = useMotionTemplate`radial-gradient(400px circle at ${mouseX}% ${mouseY}%, rgba(19,127,236,0.06), transparent 70%)`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
      mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
    },
    [mouseX, mouseY]
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl ${className}`}
      style={{
        boxShadow: "0 0 0 1px rgba(255,255,255,0.02) inset, 0 20px 60px -12px rgba(0,0,0,0.4)",
      }}
      whileHover={{ borderColor: "rgba(19,127,236,0.15)", y: -3, transition: { duration: 0.4 } }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: bg }}
      />
      {children}
    </motion.div>
  );
}
