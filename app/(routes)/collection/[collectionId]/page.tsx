"use client";

import HeroSection from "@/components/ui/pages/home/HeroSection";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import CollectionHeroDetail from "@/components/ui/pages/collection/CollectionHeroDetail";
import Footer from "@/components/ui/organisms/Footer";
import Image from "next/image";
import Carousel from "@/components/ui/molecules/Carousel";
import useIsMobile from "@/hooks/useIsMobile";
import GridImageItem from "@/components/ui/pages/collection/GridImageItem";
import { LinkItem } from "@/components/ui/atoms/LinkItem";
import CollectionImageShowSlide from "@/components/ui/pages/collection/CollectionImageShowSlide";

function CollectionDetailPage() {
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);

  const heroSection1Ref = useRef<HTMLDivElement>(null);
  const gridSectionRef = useRef<HTMLDivElement>(null);

  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const [isAtBottom, setIsAtBottom] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
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
      //  heroSection2Ref.current,
      //  heroSection3Ref.current,
      //  heroSection4Ref.current,
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
      //   heroSection2Ref.current,
      //   heroSection3Ref.current,
      //   heroSection4Ref.current,
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
        src: "/images/desktop-collection-becoming-hero.webp",
      },
      {
        type: "image" as const,
        src: "/images/tablet-collection-becoming-hero.webp",
      },
      {
        type: "image" as const,
        src: "/images/mobile-collection-becoming-hero.webp",
      },
      {
        type: "image" as const,
        src: "/images/desktop-collection-becoming-campaign-1.webp",
      },
      {
        type: "image" as const,
        src: "/images/desktop-collection-becoming-campaign-2.webp",
      },
      {
        type: "image" as const,
        src: "/images/tablet-collection-becoming-campaign-1.webp",
      },
      {
        type: "image" as const,
        src: "/images/tablet-collection-becoming-campaign-2.webp",
      },
      {
        type: "image" as const,
        src: "/images/mobile-collection-becoming-campaign-1.webp",
      },
      {
        type: "image" as const,
        src: "/images/mobile-collection-becoming-campaign-2.webp",
      },
      {
        type: "image" as const,
        src: "/images/collection-becoming-gallery-look-1.webp",
      },
      { type: "image" as const, src: "/images/tablet-second-collection.webp" },
      { type: "image" as const, src: "/images/mobile-second-collection.webp" },
      { type: "image" as const, src: "/images/desktop-third-collection.webp" },
      { type: "image" as const, src: "/images/tablet-third-collection.webp" },
      { type: "image" as const, src: "/images/mobile-third-collection.webp" },
    ],
    firstParameter: [
      "MEMOÍ - for the woman becoming herself",
      [
        { url: "/collection", title: "SS26" },
        { url: "/collection", title: "THE BECOMING" },
      ],
      [
        { url: "/collection", title: "SS26" },
        { url: "/collection", title: "THE BECOMING" },
      ],
      [
        { url: "/collection", title: "SS26" },
        { url: "/collection", title: "THE BECOMINGe" },
      ],
    ],
    secondParameter: [
      { url: "/shop", title: "Shop" },
      { url: "/collection", title: "Discover" },
      { url: "/collection", title: "Discover" },
      { url: "/collection", title: "Discover" },
    ],
    heroDetail: {
      id: "SS26",
      title: "THE BECOMING",
      numberOfItems: 10,
      urlTitle: "Shop the collection",
      url: "/shop/collection/Becoming",
    },
    slider: [
      {
        type: "image" as const,
        src: "/images/collection-becoming-slider-look-1.webp",
      },
      {
        type: "image" as const,
        src: "/images/collection-becoming-slider-look-2.webp",
      },
      {
        type: "image" as const,
        src: "/images/collection-becoming-slider-look-3.webp",
      },
      {
        type: "image" as const,
        src: "/images/collection-becoming-slider-look-4.webp",
      },
    ],
    slideShow: [
      "/images/collection-becoming-gallery-look-1.webp",
      "/images/collection-becoming-gallery-look-2.webp",
      "/images/collection-becoming-gallery-look-3.webp",
      "/images/collection-becoming-gallery-look-4.webp",
      "/images/collection-becoming-gallery-look-5.webp",
      "/images/collection-becoming-gallery-look-6.webp",
      "/images/collection-becoming-gallery-look-7.webp",
    ],
  };

  return (
    <div className="relative w-full h-full bg-[#fffefa]">
      <div
        ref={smoothWrapperRef}
        className={`h-svh ${isAtBottom ? "" : "overflow-hidden"} `}
        style={{
          overscrollBehaviorY:
            currentSectionIndex === 0 && !isAtBottom ? "auto" : "contain",
        }}
      >
        <div ref={smoothContentRef} className="bg-[#fffefa]">
          <div
            ref={heroSection1Ref}
            className="h-svh"
            data-header-theme="dark"
          >
            <HeroSection
              ref={heroSection1Ref}
              media={exampleWithLinks.media[0]}
              tabletMedia={exampleWithLinks.media[1]}
              mobileMedia={exampleWithLinks.media[2]}
            >
              <CollectionHeroDetail
                id={exampleWithLinks.heroDetail.id}
                title={exampleWithLinks.heroDetail.title}
                numberOfItems={exampleWithLinks.heroDetail.numberOfItems}
                urlTitle={exampleWithLinks.heroDetail.urlTitle}
                url={`${exampleWithLinks.heroDetail.url}`}
              />
            </HeroSection>
          </div>

          <section
            ref={gridSectionRef}
            className="min-h-svh w-full text-black gap-16 py-20 relative flex flex-col items-center text-center max-mobile:gap-10 max-mobile:pb-10 max-mobile:pt-24"
            data-header-theme="light"
          >
            <div className="gap-16 relative flex flex-col items-center text-center ">
              <div className="relative flex flex-col items-center text-center gap-6 max-w-[480px] smaller-tablet:max-tablet:max-w-[590px] max-mobile:w-full max-mobile:px-5 max-mobile:gap-4">
                <div className="font-regular p-2.5 text-2xl max-tablet:text-lg max-mobile:p-0">
                  SS26 THE BECOMING
                </div>
                <div className="text-[14px] leading-normal tracking-0 smaller-tablet:max-tablet:p-2.5 max-mobile:text-xs">
                  <div>“THE BECOMING” is a woman’s journey of finding herself.</div>
                  <div>
                    The collection is the perspective reflected through the
                    mirror in which she sees her own image. This becoming is not
                    about turning into someone else, but about discovering who
                    she truly is.
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full">
              {[
                {
                  slice: [3, 5],
                  breakpoint: "laptop:grid hidden",
                  sizes: "(min-width: 1025px) 50vw, 0px",
                },
                {
                  slice: [5, 7],
                  breakpoint: "smaller-tablet:max-tablet:grid hidden",
                  sizes: "(min-width: 768px) and (max-width: 1024px) 50vw, 0px",
                },
                {
                  slice: [7, 9],
                  breakpoint: "max-mobile:grid hidden",
                  sizes: "(max-width: 767px) 50vw, 0px",
                },
              ].map(({ slice, breakpoint, sizes }, gridIndex) => (
                <div
                  key={gridIndex}
                  className={`grid grid-cols-2 gap-2.5 ${breakpoint}`}
                >
                  {exampleWithLinks.media
                    .slice(slice[0], slice[1])
                    .map((media, index) => (
                      <div
                        key={index}
                        className="relative w-full aspect-8/9 max-tablet:aspect-2/3"
                      >
                        <Image
                          src={media.src}
                          fill
                          loading="eager"
                          sizes={sizes}
                          alt={`Collection image ${slice[0] + index}`}
                          className="object-cover object-center"
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>
            <div className="text-center max-w-[500px] p-2.5 mx-auto text-[14px] leading-normal tracking-0  max-mobile:w-full max-mobile:px-5 max-mobile:text-xs ">
              When she loves herself — embracing even the cracks in the mirror —
              she touches the beginning of something New. More than a feeling,
              that understanding becomes her compass.
            </div>
            <div className="relative w-full">
              {[
                {
                  breakpoint: "laptop:grid hidden",
                  sizes: "(min-width: 1025px) 50vw, 0px",
                },
                {
                  breakpoint: "smaller-tablet:max-tablet:grid hidden",
                  sizes: "(min-width: 768px) and (max-width: 1024px) 50vw, 0px",
                },
                {
                  breakpoint: "max-mobile:grid hidden",
                  sizes: "(max-width: 767px) 50vw, 0px",
                },
              ].map(({ breakpoint, sizes }, gridIndex) => (
                <div key={gridIndex} className={`${breakpoint}`}>
                  <div className="relative w-1/3 mx-auto aspect-auto smaller-tablet:max-tablet:w-3/5 max-mobile:w-2/3">
                    <CollectionImageShowSlide
                      sizes={sizes}
                      images={exampleWithLinks.slideShow}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center max-w-[500px] p-2.5 mx-auto text-[14px] leading-normal tracking-0 smaller-tablet:max-tablet:max-w-[590px] max-mobile:w-full max-mobile:px-5 max-mobile:text-xs">
              The collection speaks to individuals with a modern lifestyle -
              those who seek versatile, real-life-ready designs that balance
              practicality with subtle sophistication. Each piece is refined yet
              effortless, never overly ornate yet never plain, thanks to its
              thoughtful details. Rather than targeting a specific demographic,
              BECOMING is created for anyone in the midst of transformation -
              those who are ready for change, ready to embrace something new.
            </div>
            <div className="w-full flex flex-col gap-10 max-mobile:gap-6">
              <div className="w-full">
                <Carousel
                  items={[
                    <GridImageItem
                      key={1}
                      src={exampleWithLinks.slider[0].src}
                      alt={`Slider image`}
                    />,
                    <GridImageItem
                      key={2}
                      src={exampleWithLinks.slider[1].src}
                      alt={`Slider image`}
                    />,
                    <GridImageItem
                      key={3}
                      src={exampleWithLinks.slider[2].src}
                      alt={`Slider image`}
                    />,
                    <GridImageItem
                      key={4}
                      src={exampleWithLinks.slider[3].src}
                      alt={`Slider image`}
                    />,
                    <GridImageItem
                      key={5}
                      src={exampleWithLinks.slider[0].src}
                      alt={`Slider image`}
                    />,
                    <GridImageItem
                      key={6}
                      src={exampleWithLinks.slider[1].src}
                      alt={`Slider image`}
                    />,
                    <GridImageItem
                      key={7}
                      src={exampleWithLinks.slider[2].src}
                      alt={`Slider image`}
                    />,
                    <GridImageItem
                      key={8}
                      src={exampleWithLinks.slider[3].src}
                      alt={`Slider image`}
                    />,
                  ]}
                  slidesPerView={isMobile ? 2 : isLargeTablet ? 3 : 4}
                  spaceBetween={10}
                  autoplay={{
                    delay: 1000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  speed={1800}
                />
              </div>
              <div className="text-[16px] max-mobile:text-sm">
                <LinkItem
                  url={`${exampleWithLinks.heroDetail.url}/${exampleWithLinks.heroDetail.title}`}
                  title={exampleWithLinks.heroDetail.urlTitle}
                  style="text-black relative inline-flex leading-[18px] after:absolute after:left-0 after:-bottom-px after:h-px after:w-full after:origin-left after:scale-x-100 after:bg-black/40"
                />
              </div>
            </div>
          </section>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default CollectionDetailPage;
