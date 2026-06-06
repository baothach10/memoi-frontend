"use client";

import { useLayoutEffect, useState } from "react";

export default function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    const check = () => {
      const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
      const isTouchDevice =
        navigator.maxTouchPoints > 0 || "ontouchstart" in window;
      setIsMobile(media.matches && isTouchDevice);
    };

    check(); // ✅ Run once on mount
    window.addEventListener("resize", check, { passive: true });

    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}