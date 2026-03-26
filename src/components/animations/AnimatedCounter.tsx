"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState(value);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const match = value.match(/^([^0-9]*)([0-9.]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const numStr = match?.[2] ?? value;
  const suffix = match?.[3] ?? "";
  const target = parseFloat(numStr);
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = target * eased;
      setDisplayed(`${prefix}${current.toFixed(decimals)}${suffix}`);
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, target, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={className}>
      {displayed}
    </span>
  );
}
