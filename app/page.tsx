"use client";

import { LERP_FACTOR, NORMALIZED_DELTA } from "@/constants";
import GridSectionWithFooter from "../components/ui/pages/home/GridSectionWithFooter";
import HeroSection from "../components/ui/pages/home/HeroSection";
import { useCallback, useEffect, useRef, useState } from "react";

export default function HomePage() {
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);

  const heroSection1Ref = useRef<HTMLDivElement>(null);
  const heroSection2Ref = useRef<HTMLDivElement>(null);
  const heroSection3Ref = useRef<HTMLDivElement>(null);
  const heroSection4Ref = useRef<HTMLDivElement>(null);
  const gridSectionRef = useRef<HTMLDivElement>(null);

  const currentIndexRef = useRef(0);
  const targetYRef = useRef(0);
  const currentYRef = useRef(0);
  const isSettlingRef = useRef(false);
  const lastWheelTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [isAtBottom, setIsAtBottom] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);


  /** --------------------------------------------------------
   *  Section Offsets Helper
   * -------------------------------------------------------- */
  const getSections = useCallback(() => {
    return [
      heroSection1Ref.current,
      heroSection2Ref.current,
      heroSection3Ref.current,
      heroSection4Ref.current,
      gridSectionRef.current,
    ].filter(Boolean) as HTMLElement[];
  }, []);

  /** --------------------------------------------------------
   *  Animation Loop (RAF)
   * -------------------------------------------------------- */
  useEffect(() => {
    let lastTime: number | null = null; // track last frame time

    const animate = (timestamp: number) => {
      const sections = getSections();
      if (sections.length === 0) return;

      // Calculate time since last frame in seconds
      if (lastTime === null) lastTime = timestamp;
      const deltaTime = (timestamp - lastTime) / 1000; // convert ms → seconds
      lastTime = timestamp;

      // Clamp deltaTime to avoid huge jumps (e.g. tab was inactive)
      const clampedDelta = Math.min(deltaTime, 0.1);

      const dist = Math.abs(targetYRef.current - currentYRef.current);

      if (dist < 1) {
        isSettlingRef.current = false;
        if (currentIndexRef.current === sections.length - 1) {
          setIsAtBottom(true);
        }
      }

      // Time-normalized LERP — same speed on all refresh rates
      const lerpFactor = 1 - Math.pow(1 - LERP_FACTOR, clampedDelta * NORMALIZED_DELTA);
      currentYRef.current += (targetYRef.current - currentYRef.current) * lerpFactor;

      if (smoothContentRef.current) {
        smoothContentRef.current.style.transform = `translate3d(0, ${-currentYRef.current}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    // Pass timestamp to rAF
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [getSections]);

  /** --------------------------------------------------------
   *  Input Handlers
   * -------------------------------------------------------- */
  const onScrollInput = useCallback((deltaY: number) => {
    if (isSettlingRef.current) return;

    // Require a minimum threshold to trigger a snap
    if (Math.abs(deltaY) < 20) return;

    const sections = getSections();
    const lastIndex = sections.length - 1;
    let newIndex = currentIndexRef.current;

    if (deltaY > 0) {
      newIndex = Math.min(newIndex + 1, lastIndex);
    } else {
      newIndex = Math.max(newIndex - 1, 0);
    }

    if (newIndex !== currentIndexRef.current) {
      isSettlingRef.current = true;
      currentIndexRef.current = newIndex;
      setCurrentSectionIndex(newIndex);
      targetYRef.current = sections[newIndex].offsetTop;

      if (newIndex !== lastIndex) {
        setIsAtBottom(false);
      }
    }
  }, [getSections]);

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

      lastWheelTimeRef.current = Date.now();

      // Prevent snap if native scroll still active
      if (isAtBottom) {
        if (
          e.deltaY < 0 &&
          gridSectionRef.current &&
          gridSectionRef.current.getBoundingClientRect().top >= 0
          && Math.abs(e.deltaY) > 50
        ) {
          e.preventDefault();
          onScrollInput(e.deltaY);
        }
        return;
      }

      e.preventDefault();
      onScrollInput(e.deltaY);
    };

    window.addEventListener("wheel", wheelHandler, { passive: false });

    return () => {
      window.removeEventListener("wheel", wheelHandler);
    };
  }, [isAtBottom, onScrollInput]);

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

          window.scrollTo(0, 0);
          setIsAtBottom(false);
          // Set target to previous section immediately
          // handleScrollGesture("up");
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
      const isAtFirstSection = targetYRef.current <= 0;

      // At the first section, scrolling up → allow native browser behavior
      if (isAtFirstSection && isScrollingUp) {
        return;
      }

      // Intercept and snap
      e.preventDefault();
      onScrollInput(deltaY);
      startY = currentY;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [isAtBottom, onScrollInput]);

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
      if (wrapper.scrollTop <= gridTop - 1) {
        try {
          wrapper.scrollTop = 0;
        } catch (err) {
          void err;
        }

        // Immediately switch back to virtual scroll mode to avoid rubber-banding
        setIsAtBottom(false);

        // Pull the targetY back up one section
        const prevIndex = Math.max(0, lastIndex - 1);
        isSettlingRef.current = true;
        currentIndexRef.current = prevIndex;
        setCurrentSectionIndex(prevIndex);
        targetYRef.current = sections[prevIndex].offsetTop;
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
      { type: "video" as const, src: "/videos/homepage-video-horizontal.mp4" },
      { type: "video" as const, src: "/videos/homepage-video-horizontal.mp4" },
      { type: "video" as const, src: "/videos/homepage-video-horizontal.mp4" },
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
      "MEMOÍ - for the woman you are becoming",
      [
        { url: "/collection/ss26-the-becoming", title: "SS26" },
        { url: "/collection/ss26-the-becoming", title: "THE BECOMING" },
      ],
      [
        { url: "/collection/ss26-the-becoming", title: "SS26" },
        { url: "/collection/ss26-the-becoming", title: "THE BECOMING" },
      ],
      [
        { url: "/collection/ss26-the-becoming", title: "SS26" },
        { url: "/collection/ss26-the-becoming", title: "THE BECOMING" },
      ],
    ],
    secondParameter: [
      { url: "/shop/all-products", title: "Shop" },
      { url: "/collection/ss26-the-becoming", title: "Discover" },
      { url: "/collection/ss26-the-becoming", title: "Discover" },
      { url: "/collection/ss26-the-becoming", title: "Discover" },
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
            className="h-svh relative"
            data-header-theme="dark"
          >
            <HeroSection
              ref={heroSection1Ref}
              media={exampleWithLinks.media[0]}
              tabletMedia={exampleWithLinks.media[1]}
              mobileMedia={exampleWithLinks.media[2]}
              videoPosterHorizontal="/images/homepage-video-frame-horizontal.jpg"
              videoPosterVertical="/images/homepage-video-frame-vertical.jpg"
              videoHorizontalSrc="/videos/homepage-video-horizontal.mp4"
              videoVerticalSrc="/videos/homepage-video-vertical.mp4"
              firstParameter={exampleWithLinks.firstParameter[0]}
              secondParameter={exampleWithLinks.secondParameter[0]}
            />
          </div>

          <div
            ref={heroSection2Ref}
            className="h-svh relative"
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
            className="h-svh relative"
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
            className="h-svh relative"
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
