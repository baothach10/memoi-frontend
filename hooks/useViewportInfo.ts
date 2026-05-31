"use client";

import { useEffect, useState } from "react";

type Breakpoint = "mobile" | "tablet" | "desktop";

export default function useViewportInfo() {
  const [state, setState] = useState({
    mounted: false,
    isPortrait: false,
    breakpoint: "desktop" as Breakpoint,
  });

  useEffect(() => {
    const update = () => {
      setState({
        mounted: true,
        isPortrait: window.matchMedia("(orientation: portrait)").matches,
        breakpoint:
          window.innerWidth < 768
            ? "mobile"
            : window.innerWidth < 1024
              ? "tablet"
              : "desktop",
      });
    };

    update();

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  return state;
}
