"use client";

import Footer from "@/components/ui/organisms/Footer";
import HeroSection from "@/components/ui/pages/home/HeroSection";
import ShopAllProductsGrid from "@/components/ui/pages/shop/ShopAllProductsGrid";
import useIsMobile from "@/hooks/useIsMobile";
import { gsap } from "gsap";
import Link from "next/link";
import { useRef, useState, useCallback, useEffect } from "react";

// Main Home Component
export default function ShopPage() {
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);

  const heroSection1Ref = useRef<HTMLElement>(null);
  const gridSectionRef = useRef<HTMLDivElement>(null);

  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const [isAtBottom, setIsAtBottom] = useState(false);
  const isMobile = useIsMobile(1024);
  const isLargeTablet = useIsMobile(1200);


  const SCROLL_DEBOUNCE = 1500; // ms
  const lastScrollTimeRef = useRef(0);



  /** --------------------------------------------------------
   *  Smooth GSAP transition to section index
   * -------------------------------------------------------- */
  const scrollToSection = (index: number) => {
    const content = smoothContentRef.current;
    const wrapper = smoothWrapperRef.current;

    if (!content || !wrapper) return;

    const sections = [
      heroSection1Ref.current,
      gridSectionRef.current,
      // footerSectionRef.current,
    ].filter(Boolean) as HTMLElement[];

    if (index < 0 || index >= sections.length) return;

    const targetEl = sections[index];
    const targetTop = targetEl.offsetTop;

    isAnimatingRef.current = true;

    const lastIndex = sections.length - 1;

    // Normal snap behavior for non-last sections: translate the content container
    gsap.to(content, {
      y: -targetTop,
      duration: 1,
      ease: "power3.inOut",
      onComplete: () => {
        if (currentIndexRef.current === lastIndex) {
          setIsAtBottom(true);
        } else {
          setIsAtBottom(false);
        }
        isAnimatingRef.current = false;
      },
    });
  };

  /** --------------------------------------------------------
   *  Wheel handler with debounce
   * -------------------------------------------------------- */
  const handleScrollGesture = useCallback((direction: "up" | "down") => {
    const now = Date.now();
    if (isAnimatingRef.current) return;
    if (now - lastScrollTimeRef.current < SCROLL_DEBOUNCE) return;

    lastScrollTimeRef.current = now;

    const sections = [heroSection1Ref.current, gridSectionRef.current].filter(
      Boolean
    ) as HTMLElement[];

    let newIndex = currentIndexRef.current;

    if (direction === "down") {
      newIndex = Math.min(newIndex + 1, sections.length - 1);
    } else {
      newIndex = Math.max(newIndex - 1, 0);
    }

    if (newIndex !== currentIndexRef.current) {
      currentIndexRef.current = newIndex;

      scrollToSection(newIndex);
    }
  }, []);

  /** --------------------------------------------------------
   *  Wheel Event Listener
   * -------------------------------------------------------- */
  useEffect(() => {
    const wheelHandler = (e: WheelEvent) => {
      // If the mobile menu is open, ignore wheel events for page snapping
      if (
        typeof document !== "undefined" &&
        document.body.classList.contains("menu-open")
      ) {
        e.preventDefault();
        return;
      }
      const gridEl = gridSectionRef.current;

      // still allow native scrolling inside grid
      if (gridEl && gridEl.contains(e.target as Node)) {
        const canScroll = gridEl.scrollHeight > gridEl.clientHeight;
        const down = e.deltaY > 0;
        const atBottom =
          gridEl.scrollTop + gridEl.clientHeight >= gridEl.scrollHeight - 1;
        const atTop = gridEl.scrollTop <= 1;

        if (canScroll && ((down && !atBottom) || (!down && !atTop))) {
          return;
        }
      }

      // Prevent snap if native scroll still active
      if (isAtBottom) {
        // allow wheel event to bubble so wrapper scroll listener can detect "back up"
        if (
          e.deltaY < 0 &&
          gridSectionRef.current &&
          gridSectionRef.current.getBoundingClientRect().top >= 0 &&
          Math.abs(e.deltaY) > 30
        ) {
          e.preventDefault();
          setIsAtBottom(false);
          handleScrollGesture(e.deltaY > 0 ? "down" : "up");
        }
        return;
      }

      e.preventDefault();
      handleScrollGesture(e.deltaY > 0 ? "down" : "up");
    };

    window.addEventListener("wheel", wheelHandler, { passive: false });

    return () => {
      window.removeEventListener("wheel", wheelHandler);
    };
  }, [handleScrollGesture, isAtBottom]);

  /** --------------------------------------------------------
   *  Touch Events (Mobile)
   * -------------------------------------------------------- */
  useEffect(() => {
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      // If mobile menu is open, ignore touch move for page snapping
      if (
        typeof document !== "undefined" &&
        document.body.classList.contains("menu-open")
      ) {
        e.preventDefault();
        return;
      }

      // If we've reached the last section, allow native touch scrolling freely
      if (isAtBottom) return;
      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      if (Math.abs(deltaY) < 0) return;

      // If touch starts inside the grid section and it can scroll, allow native scrolling unless at boundary
      const gridEl = gridSectionRef.current;
      const target = e.target as HTMLElement | null;
      if (gridEl && target && gridEl.contains(target)) {
        const canScrollVertically = gridEl.scrollHeight > gridEl.clientHeight;
        if (canScrollVertically) {
          const scrollingDown = deltaY > 0;
          const atBottom =
            gridEl.scrollTop + gridEl.clientHeight >= gridEl.scrollHeight - 1;
          const atTop = gridEl.scrollTop <= 1;

          if ((scrollingDown && !atBottom) || (!scrollingDown && !atTop)) {
            // let browser handle native scroll inside the grid
            startY = currentY;
            return;
          }
          // else, fall through to handle section snap when at boundary
        }
      }

      // Intercept and snap when not handled by native scroll
      e.preventDefault();
      if (deltaY > 0) handleScrollGesture("down");
      else handleScrollGesture("up");
      startY = currentY;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [handleScrollGesture, isAtBottom]);

  /** --------------------------------------------------------
   *  When the page is in native-scroll mode for the last section
   *  (isAtBottom === true) we need to detect when the user scrolls
   *  back up out of that section. When the wrapper's scrollTop passes
   *  above the last section's offset we switch back to the per-section
   *  snapping behavior and animate the content container to the
   *  previous section.
   * -------------------------------------------------------- */
  useEffect(() => {
    if (!isAtBottom) return;

    const wrapper = smoothWrapperRef.current;
    const content = smoothContentRef.current;
    if (!wrapper || !content) return;

    const sections = [
      heroSection1Ref.current,
      //   heroSection2Ref.current,
      //   heroSection3Ref.current,
      gridSectionRef.current,
    ].filter(Boolean) as HTMLElement[];

    const lastIndex = sections.length - 1;
    const gridTop = sections[lastIndex]?.offsetTop ?? 0;

    const onWrapperScroll = () => {
      // If wrapper.scrollTop has moved above the grid's top, user intends to
      // go back to the previous section — restore snap behavior.
      if (wrapper.scrollTop <= gridTop - 1) {
        // detach listener to avoid reentrancy
        wrapper.removeEventListener("scroll", onWrapperScroll);

        // Reset wrapper scroll to avoid a visual jump while we animate
        // the content transform back into snap mode.
        try {
          wrapper.scrollTop = 0;
        } catch (err) {
          void err;
        }

        setIsAtBottom(false);

        const prevIndex = Math.max(0, lastIndex - 1);
        currentIndexRef.current = prevIndex;

        // Animate the content container to the previous section position
        const targetTop = sections[prevIndex].offsetTop;
        isAnimatingRef.current = true;
        gsap.to(content, {
          y: -targetTop,
          duration: 1,
          ease: "power3.inOut",
          onComplete: () => {
            isAnimatingRef.current = false;
          },
        });
      }
    };

    wrapper.addEventListener("scroll", onWrapperScroll, { passive: true });

    return () => {
      wrapper.removeEventListener("scroll", onWrapperScroll);
    };
  }, [isAtBottom]);

  // Example content
  const exampleWithLinks = {
    media: [
      {
        type: "image" as const,
        src: "/images/shop-menu.webp",
      },
      {
        type: "image" as const,
        src: "/images/shop-menu.webp",
      },
      {
        type: "image" as const,
        src: "/images/shop-menu.webp",
      },
    ],
    heroDetail: {
      title: "All products",
      numberOfItems: 10,
      urlTitle: "Shop the collection",
      url: "/shop",
    }
  };

  const itemsList = ["Dresses", "Tops", "Skirts", "Pants"];


  return (
    <div className="relative w-full h-full bg-[#fffefa]`">
      <div
        ref={smoothWrapperRef}
        className={`h-screen ${isAtBottom ? "" : "overflow-hidden"} `}
      >
        <div ref={smoothContentRef} className="bg-[#fffefa]">
          <section ref={heroSection1Ref} className="h-screen" data-header-theme="dark">
            <div className="relative h-full w-full">
              <HeroSection
                ref={heroSection1Ref}
                media={exampleWithLinks.media[0]}
                tabletMedia={exampleWithLinks.media[1]}
                mobileMedia={exampleWithLinks.media[2]}
              />
              <div className="text-white gap-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-1">
                <div className="gap-3 flex flex-col items-center justify-center">
                  {itemsList.map((item) => (
                    <Link href={"/shop"} key={item}>
                      <div className="text-[16px] capitalize">{item}</div>
                    </Link>
                  ))}
                </div>
                <div className="text-[16px]">All products</div>
              </div>
            </div>
          </section>

          <section
            ref={gridSectionRef}
            data-header-theme="light"
            className="min-h-screen w-full text-black gap-16 py-20 relative flex flex-col items-center text-center max-mobile:gap-10 max-mobile:py-10"
          >
            <div className="mx-auto text-center space-y-2">
              <div className="text-black leading-[1.2] text-2xl max-mobile:text-sm">
                <div className="flex flex-wrap justify-center gap-4 font-regular">
                  <div
                    className={`uppercase transition-colors decoration-white/40`}
                  >
                    {exampleWithLinks.heroDetail.title}
                  </div>
                </div>
              </div>
              <div className="text-black/60 text-[14px]">
                {exampleWithLinks.heroDetail.numberOfItems} products
              </div>
            </div>
            <ShopAllProductsGrid />


          </section>

          <Footer />
        </div>
      </div>
    </div>
  );
}
