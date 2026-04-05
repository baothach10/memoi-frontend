import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";


export function useHeaderTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const pathname = usePathname();

  useEffect(() => {
    const bottomOffset = Math.max(window.innerHeight - 100, 0);

    const intersectionObserver = new IntersectionObserver(
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

    const observeSections = () => {
      const sections = document.querySelectorAll("[data-header-theme]");
      sections.forEach((s) => intersectionObserver.observe(s));
    };

    // Use MutationObserver to watch for elements added dynamicially
    const mutationObserver = new MutationObserver(() => {
      observeSections();
    });

    // Start observing the wrapper element or document body
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Initial run
    observeSections();

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return theme;
}
