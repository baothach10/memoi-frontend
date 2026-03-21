import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";


export function useHeaderTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const pathname = usePathname();

  useEffect(() => {
    const sections = document.querySelectorAll("[data-header-theme]");

    if (!sections.length) return;
    
    const bottomOffset = Math.max(window.innerHeight - 60, 0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const theme = entry.target.getAttribute("data-header-theme");
            if (theme === "light" || theme === "dark") {
              setTheme(theme);
            }
          }
        });
      },
      {
        rootMargin: `-20px 0px -${bottomOffset}px 0px`,
        threshold: 0,
      }
    );

    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, [pathname]); // 🔥 re-run on navigation

  return theme;
}
