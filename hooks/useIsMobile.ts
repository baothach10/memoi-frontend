"use client";

import { useEffect, useLayoutEffect, useState } from "react";

// export default function useIsMobile(breakpoint = 1024) {
//   const [isMobile, setIsMobile] = useState<boolean | null>(null);

//   useLayoutEffect(() => {
//     const check = () => {
//       setIsMobile(window.innerWidth < breakpoint);
//     };

//     check(); // ✅ Run once on mount
//     window.addEventListener("resize", check, { passive: true });

//     return () => window.removeEventListener("resize", check);
//   }, [breakpoint]);

//   return isMobile;
// }

export default function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const update = () => setIsMobile(media.matches);

    update(); // ✅ set before paint
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}
