"use client";

import { Header } from "@/components/ui/organisms/Header";
import GridSectionWithFooter from "../components/pages/home/GridSectionWithFooter";
import HeroSection from "../components/pages/home/HeroSection";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Main Home Component
export default function HomePage() {
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);
  const heroSection1Ref = useRef<HTMLElement>(null);
  const heroSection2Ref = useRef<HTMLElement>(null);
  const heroSection3Ref = useRef<HTMLElement>(null);
  const gridSectionRef = useRef<HTMLDivElement>(null);
  const currentSectionRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const lastScrollTimeRef = useRef(0);

  useEffect(() => {
    if (!smoothWrapperRef.current || !smoothContentRef.current) return;

    const sections = [
      heroSection1Ref.current,
      heroSection2Ref.current,
      heroSection3Ref.current,
      gridSectionRef.current,
    ].filter(Boolean) as HTMLElement[];

    const scrollDelay = 2000; // Delay between section changes in ms

    const scrollToSection = (index: number) => {
      if (index < 0 || index >= sections.length || isAnimatingRef.current)
        return;

      isAnimatingRef.current = true;
      currentSectionRef.current = index;

      const targetSection = sections[index];
      const targetPosition = targetSection.offsetTop;

      gsap.to(smoothContentRef.current, {
        y: -targetPosition,
        duration: 0.5,
        ease: "sine.inOut",
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = Date.now();
      if (
        now - lastScrollTimeRef.current < scrollDelay ||
        isAnimatingRef.current
      ) {
        return;
      }

      if (e.deltaY > 0) {
        // Scroll down
        const nextSection = Math.min(
          currentSectionRef.current + 1,
          sections.length - 1
        );
        if (nextSection !== currentSectionRef.current) {
          lastScrollTimeRef.current = now;
          scrollToSection(nextSection);
        }
      } else {
        // Scroll up
        const prevSection = Math.max(currentSectionRef.current - 1, 0);
        if (prevSection !== currentSectionRef.current) {
          lastScrollTimeRef.current = now;
          scrollToSection(prevSection);
        }
      }
    };

    const wrapper = smoothWrapperRef.current;
    wrapper.addEventListener("wheel", handleWheel, { passive: false });

    // Initial position
    gsap.set(smoothContentRef.current, { y: 0 });

    return () => {
      wrapper.removeEventListener("wheel", handleWheel);
    };
  }, []);
  // const exampleWithLinks = {
  //   media: {
  //     type: "video" as const,
  //     src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  //   },
  //   firstParameter: [
  //     { url: "https://example.com/link1", title: "Explore More" },
  //     { url: "https://example.com/link2", title: "Get Started" },
  //     { url: "https://example.com/link3", title: "Learn More" },
  //   ],
  //   secondParameter: {
  //     url: "https://example.com/contact",
  //     title: "Contact Us",
  //   },
  // };

  // Example 2: With text instead of links
  const exampleWithLinks = {
    media: [
      {
        type: "image" as const,
        src: "/images/desktop-first-collection.webp",
      },
      {
        type: "image" as const,
        src: "/images/desktop-second-collection.webp",
      },
      {
        type: "image" as const,
        src: "/images/desktop-third-collection.webp",
      },
    ],
    firstParameter:
      "Welcome to our amazing platform. Discover the future of innovation.",
    secondParameter: {
      url: "https://example.com/signup",
      title: "Sign Up Now",
    },
  };

  return (
    <div className="relative">
      <Header />
      <div
        id="smooth-wrapper"
        ref={smoothWrapperRef}
        className="h-screen overflow-hidden"
      >
        <div id="smooth-content" ref={smoothContentRef}>
          <HeroSection
            ref={heroSection1Ref}
            media={exampleWithLinks.media[0]}
            firstParameter={exampleWithLinks.firstParameter}
            secondParameter={exampleWithLinks.secondParameter}
          />
          <HeroSection
            ref={heroSection2Ref}
            media={exampleWithLinks.media[1]}
            firstParameter={exampleWithLinks.firstParameter}
            secondParameter={exampleWithLinks.secondParameter}
          />
          <HeroSection
            ref={heroSection3Ref}
            media={exampleWithLinks.media[2]}
            firstParameter={exampleWithLinks.firstParameter}
            secondParameter={exampleWithLinks.secondParameter}
          />
          <GridSectionWithFooter ref={gridSectionRef} />
        </div>
      </div>
    </div>
  );
}
