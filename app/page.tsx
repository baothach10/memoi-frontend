"use client";

import GridSectionWithFooter from "../components/ui/pages/home/GridSectionWithFooter";
import HeroSection from "../components/ui/pages/home/HeroSection";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function HomePage() {
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);

  const heroSection1Ref = useRef<HTMLDivElement>(null);
  const heroSection2Ref = useRef<HTMLDivElement>(null);
  const heroSection3Ref = useRef<HTMLDivElement>(null);
  const heroSection4Ref = useRef<HTMLDivElement>(null);
  const gridSectionRef = useRef<HTMLDivElement>(null);

  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const [isAtBottom, setIsAtBottom] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

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
      heroSection2Ref.current,
      heroSection3Ref.current,
      heroSection4Ref.current,
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

    const sections = [
      heroSection1Ref.current,
      heroSection2Ref.current,
      heroSection3Ref.current,
      heroSection4Ref.current,
      gridSectionRef.current,
    ].filter(Boolean) as HTMLElement[];

    let newIndex = currentIndexRef.current;

    if (direction === "down") {
      newIndex = Math.min(newIndex + 1, sections.length - 1);
    } else {
      newIndex = Math.max(newIndex - 1, 0);
    }

    if (newIndex !== currentIndexRef.current) {
      currentIndexRef.current = newIndex;
      setCurrentSectionIndex(newIndex);

      scrollToSection(newIndex);
    }
  }, []);

  /** --------------------------------------------------------
   *  Wheel Event Listener
   * -------------------------------------------------------- */
  useEffect(() => {
    const wheelHandler = (e: WheelEvent) => {
      // If the mobile menu is open or overlay is open, ignore wheel events for page snapping
      if (
        typeof document !== "undefined" &&
        (document.body.classList.contains("menu-open") ||
          document.body.style.overflow === "hidden")
      ) {
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
      // If mobile menu is open or overlay is open, ignore touch move for page snapping
      if (
        typeof document !== "undefined" &&
        (document.body.classList.contains("menu-open") ||
          document.body.style.overflow === "hidden")
      ) {
        return;
      }

      // If we've reached the last section, allow native touch scrolling freely
      // but prevent pull-to-refresh when page is scrolled to the top
      if (isAtBottom) {
        const currentY = e.touches[0].clientY;
        const deltaY = startY - currentY;
        const isScrollingUp = deltaY < 0;
        const pageScrollTop = window.scrollY || document.documentElement.scrollTop || 0;

        // When page is at the very top and user swipes up,
        // prevent pull-to-refresh and snap back to previous section
        if (isScrollingUp && pageScrollTop <= 1) {
          e.preventDefault();

          if (!isAnimatingRef.current) {
            window.scrollTo(0, 0);
            setIsAtBottom(false);
            // Reset debounce so handleScrollGesture responds immediately
            lastScrollTimeRef.current = 0;
            handleScrollGesture("up");
          }
        }
        return;
      }
      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      // Ignore tiny movements (< 5px) to avoid accidental triggers
      if (Math.abs(deltaY) < 5) return;

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

      const isScrollingUp = deltaY < 0;
      const isAtFirstSection = currentIndexRef.current === 0;

      // At the first section, scrolling up → allow native browser behavior
      // (e.g. pull-to-refresh). Don't prevent default.
      if (isAtFirstSection && isScrollingUp) {
        return;
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
      heroSection2Ref.current,
      heroSection3Ref.current,
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
      { type: "image" as const, src: "/images/desktop-hero.webp" },
      { type: "image" as const, src: "/images/tablet-hero.webp" },
      { type: "image" as const, src: "/images/mobile-hero.webp" },
      { type: "image" as const, src: "/images/desktop-first-collection.webp" },
      { type: "image" as const, src: "/images/tablet-first-collection.webp" },
      { type: "image" as const, src: "/images/mobile-first-collection.webp" },
      { type: "image" as const, src: "/images/desktop-second-collection.webp" },
      { type: "image" as const, src: "/images/tablet-second-collection.webp" },
      { type: "image" as const, src: "/images/mobile-second-collection.webp" },
      { type: "image" as const, src: "/images/desktop-third-collection.webp" },
      { type: "image" as const, src: "/images/tablet-third-collection.webp" },
      { type: "image" as const, src: "/images/mobile-third-collection.webp" },
    ],
    firstParameter: [
      "MEMOÍ - for the woman becoming herself",
      [
        { url: "/collection/SS26", title: "SS26" },
        { url: "/collection/SS26", title: "Her Edge" },
      ],
      [
        { url: "/collection/SS26", title: "SS26" },
        { url: "/collection/SS26", title: "Summer Summer" },
      ],
      [
        { url: "/collection/SS26", title: "SS26" },
        { url: "/collection/SS26", title: "Reborn" },
      ],
    ],
    secondParameter: [
      { url: "/shop", title: "Shop" },
      { url: "/collection", title: "Discover" },
      { url: "/collection", title: "Discover" },
      { url: "/collection", title: "Discover" },
    ],
  };

  return (
    <div className="relative w-full h-full bg-[#fffefa]">
      <div
        ref={smoothWrapperRef}
        className={`h-svh relative ${isAtBottom ? "" : "overflow-hidden"}`}
        style={{
          overscrollBehaviorY:
            currentSectionIndex === 0 && !isAtBottom ? "auto" : "contain",
        }}
      >
        <div ref={smoothContentRef}>
          <div
            ref={heroSection1Ref}
            className="h-screen relative"
            data-header-theme="dark"
          >
            <HeroSection
              ref={heroSection1Ref}
              media={exampleWithLinks.media[0]}
              tabletMedia={exampleWithLinks.media[1]}
              mobileMedia={exampleWithLinks.media[2]}
              firstParameter={exampleWithLinks.firstParameter[0]}
              secondParameter={exampleWithLinks.secondParameter[0]}
            />
          </div>

          <div
            ref={heroSection2Ref}
            className="h-screen relative"
            data-header-theme="dark"
          >
            <HeroSection
              ref={heroSection2Ref}
              media={exampleWithLinks.media[3]}
              tabletMedia={exampleWithLinks.media[4]}
              mobileMedia={exampleWithLinks.media[5]}
              firstParameter={exampleWithLinks.firstParameter[1]}
              secondParameter={exampleWithLinks.secondParameter[1]}
            />
          </div>

          <div
            ref={heroSection3Ref}
            className="h-screen relative"
            data-header-theme="dark"
          >
            <HeroSection
              ref={heroSection3Ref}
              media={exampleWithLinks.media[6]}
              tabletMedia={exampleWithLinks.media[7]}
              mobileMedia={exampleWithLinks.media[8]}
              firstParameter={exampleWithLinks.firstParameter[2]}
              secondParameter={exampleWithLinks.secondParameter[2]}
            />
          </div>
          <div
            ref={heroSection4Ref}
            className="h-screen relative"
            data-header-theme="dark"
          >
            <HeroSection
              ref={heroSection4Ref}
              media={exampleWithLinks.media[9]}
              tabletMedia={exampleWithLinks.media[10]}
              mobileMedia={exampleWithLinks.media[11]}
              firstParameter={exampleWithLinks.firstParameter[3]}
              secondParameter={exampleWithLinks.secondParameter[3]}
            />
          </div>

          <GridSectionWithFooter ref={gridSectionRef} />
        </div>
      </div>
    </div>
  );
}
