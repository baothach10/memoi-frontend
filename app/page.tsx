"use client";

import { Header } from "@/components/ui/organisms/Header";
import GridSectionWithFooter from "../components/pages/home/GridSectionWithFooter";
import HeroSection from "../components/pages/home/HeroSection";
import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Footer from "@/components/ui/organisms/Footer";

export default function HomePage() {
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);

  const heroSection1Ref = useRef<HTMLElement>(null);
  const heroSection2Ref = useRef<HTMLElement>(null);
  const heroSection3Ref = useRef<HTMLElement>(null);
  const gridSectionRef = useRef<HTMLDivElement>(null);
  const footerSectionRef = useRef<HTMLElement>(null);

  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

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
      gridSectionRef.current,
      footerSectionRef.current,
    ].filter(Boolean) as HTMLElement[];

    if (index < 0 || index >= sections.length) return;

    const targetEl = sections[index];
    const targetTop = targetEl.offsetTop;

    isAnimatingRef.current = true;

    gsap.to(content, {
      y: -targetTop,
      duration: 1,
      ease: "power3.inOut",
      onComplete: () => {
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
      gridSectionRef.current,
      footerSectionRef.current,
    ].filter(Boolean) as HTMLElement[];

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
      e.preventDefault();
      if (e.deltaY > 0) handleScrollGesture("down");
      else handleScrollGesture("up");
    };

    window.addEventListener("wheel", wheelHandler, { passive: false });

    return () => {
      window.removeEventListener("wheel", wheelHandler);
    };
  }, [handleScrollGesture]);

  /** --------------------------------------------------------
   *  Touch Events (Mobile)
   * -------------------------------------------------------- */
  useEffect(() => {
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const deltaY = startY - e.touches[0].clientY;
      if (Math.abs(deltaY) < 30) return;
      if (deltaY > 0) handleScrollGesture("down");
      else handleScrollGesture("up");
      startY = e.touches[0].clientY;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [handleScrollGesture]);

  // Example content
  const exampleWithLinks = {
    media: [
      { type: "image" as const, src: "/images/desktop-first-collection.webp" },
      { type: "image" as const, src: "/images/desktop-second-collection.webp" },
      { type: "image" as const, src: "/images/desktop-third-collection.webp" },
    ],
    firstParameter: [
      "MEMOÍ - for the woman becoming herself",
      [
        { url: "/collection", title: "SS26" },
        { url: "/collection", title: "Her Edge" },
      ],
      [
        { url: "/collection", title: "SS26" },
        { url: "/collection", title: "Summer Summer" },
      ],
      [
        { url: "/collection", title: "SS26" },
        { url: "/collection", title: "Reborn" },
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
    <div className="relative">
      <Header />

      <div ref={smoothWrapperRef} className="h-screen overflow-hidden">
        <div ref={smoothContentRef}>
          <section ref={heroSection1Ref} className="h-screen">
            <HeroSection
              ref={heroSection1Ref}
              media={exampleWithLinks.media[0]}
              firstParameter={exampleWithLinks.firstParameter[0]}
              secondParameter={exampleWithLinks.secondParameter[0]}
            />
          </section>

          <section ref={heroSection2Ref} className="h-screen">
            <HeroSection
              ref={heroSection2Ref}
              media={exampleWithLinks.media[1]}
              firstParameter={exampleWithLinks.firstParameter[1]}
              secondParameter={exampleWithLinks.secondParameter[1]}
            />
          </section>

          <section ref={heroSection3Ref} className="h-screen">
            <HeroSection
              ref={heroSection3Ref}
              media={exampleWithLinks.media[2]}
              firstParameter={exampleWithLinks.firstParameter[2]}
              secondParameter={exampleWithLinks.secondParameter[2]}
            />
          </section>

          <section ref={gridSectionRef} className="h-screen">
            <GridSectionWithFooter ref={gridSectionRef} />
          </section>

          <section ref={footerSectionRef} className="h-screen">
            <Footer />
          </section>
        </div>
      </div>
    </div>
  );
}
