"use client";

import { useEffect, useState } from "react";
import { CursorGlow, ScrollProgress } from "@/components/animations";

export default function GlobalEffects() {
  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    // Only show custom cursor on devices with hover capability (no touch)
    const mq = window.matchMedia("(hover: hover)");
    setHasHover(mq.matches);

    if (mq.matches) {
      document.body.classList.add("cursor-none");
    }

    const handler = (e: MediaQueryListEvent) => {
      setHasHover(e.matches);
      if (e.matches) {
        document.body.classList.add("cursor-none");
      } else {
        document.body.classList.remove("cursor-none");
      }
    };
    mq.addEventListener("change", handler);
    return () => {
      mq.removeEventListener("change", handler);
      document.body.classList.remove("cursor-none");
    };
  }, []);

  return (
    <>
      {hasHover && <CursorGlow />}
      <ScrollProgress />
    </>
  );
}
