"use client";

import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { useRef, useCallback } from "react";

export default function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 20 });

  const spotX = useMotionValue(50);
  const spotY = useMotionValue(50);
  const spotBg = useMotionTemplate`radial-gradient(800px circle at ${spotX}% ${spotY}%, rgba(19,127,236,0.06), transparent 70%)`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      rotateX.set((py - 0.5) * -6);
      rotateY.set((px - 0.5) * 6);
      spotX.set(px * 100);
      spotY.set(py * 100);
    },
    [rotateX, rotateY, spotX, spotY]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    spotX.set(50);
    spotY.set(50);
  }, [rotateX, rotateY, spotX, spotY]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl z-10"
        style={{ background: spotBg }}
      />
      {children}
    </motion.div>
  );
}
