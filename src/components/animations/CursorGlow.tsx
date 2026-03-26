"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [mounted, setMounted] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  useEffect(() => {
    setMounted(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(
        t.tagName === "A" ||
          t.tagName === "BUTTON" ||
          !!t.closest("a, button, [role=button]")
      );
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!mounted) return null;
  return (
    <>
      {/* Ambient glow — follows instantly */}
      <motion.div
        className="pointer-events-none fixed z-[9998]"
        style={{
          left: x, top: y,
          width: 500, height: 500, x: "-50%", y: "-50%",
          background: "radial-gradient(circle, rgba(19,127,236,0.07) 0%, rgba(19,127,236,0.03) 30%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      {/* Outer ring — follows instantly */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full"
        style={{
          left: x, top: y, x: "-50%", y: "-50%",
          width: hovering ? 56 : 32,
          height: hovering ? 56 : 32,
          backgroundColor: "transparent",
          border: hovering ? "2px solid rgba(19,127,236,0.5)" : "1.5px solid rgba(19,127,236,0.25)",
          boxShadow: hovering
            ? "0 0 24px rgba(19,127,236,0.3), inset 0 0 12px rgba(19,127,236,0.05)"
            : "0 0 16px rgba(19,127,236,0.15)",
          transition: "width 0.25s ease, height 0.25s ease, border 0.25s ease, box-shadow 0.25s ease",
        }}
      />
      {/* Inner dot — follows instantly */}
      <motion.div
        className="pointer-events-none fixed z-[10000] rounded-full"
        style={{
          left: x, top: y, x: "-50%", y: "-50%",
          width: hovering ? 6 : 10,
          height: hovering ? 6 : 10,
          backgroundColor: "rgba(19,127,236,1)",
          boxShadow: "0 0 8px rgba(19,127,236,0.8), 0 0 24px rgba(19,127,236,0.4), 0 0 48px rgba(19,127,236,0.15)",
          transition: "width 0.25s ease, height 0.25s ease",
        }}
      />
    </>
  );
}
