"use client";

import HeroSection from "@/components/ui/pages/home/HeroSection";
import { useCallback, useEffect, useRef, useState } from "react";
import CollectionHeroDetail from "@/components/ui/pages/collection/CollectionHeroDetail";
import Footer from "@/components/ui/organisms/Footer";
import Image from "next/image";
import Carousel from "@/components/ui/molecules/Carousel";
import useIsMobile from "@/hooks/useIsMobile";
import GridImageItem from "@/components/ui/pages/collection/GridImageItem";
import { LinkItem } from "@/components/ui/atoms/LinkItem";
import CollectionImageShowSlide from "@/components/ui/pages/collection/CollectionImageShowSlide";
import { LERP_FACTOR, NORMALIZED_DELTA } from "@/constants";

function CollectionDetailPage() {
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);

  const heroSection1Ref = useRef<HTMLDivElement>(null);
  const gridSectionRef = useRef<HTMLDivElement>(null);

  const currentIndexRef = useRef(0);
  const targetYRef = useRef(0);
  const currentYRef = useRef(0);
  const isSettlingRef = useRef(false);
  const lastWheelTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [isAtBottom, setIsAtBottom] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const isMobile = useIsMobile(1024);
  const isLargeTablet = useIsMobile(1200);

  const getSections = useCallback(() => {
    return [
      heroSection1Ref.current,
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

      lastWheelTimeRef.current = Date.now();

      // Prevent snap if native scroll still active
      if (isAtBottom) {
        if (
          e.deltaY < 0 &&
          gridSectionRef.current &&
          gridSectionRef.current.getBoundingClientRect().top >= 0 &&
          Math.abs(e.deltaY) > 50
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
      const isAtFirstSection = currentIndexRef.current === 0;

      // At the first section, scrolling up → allow native browser behavior
      // (e.g. pull-to-refresh). Don't prevent default.
      if (isAtFirstSection && isScrollingUp) {
        return;
      }

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
      gridSectionRef.current,
    ].filter(Boolean) as HTMLElement[];

    const lastIndex = sections.length - 1;

    const onWrapperScroll = () => {
      // Only snap back when the user has scrolled all the way back to the
      // top of the native-scroll wrapper. scrollTop <= 0 is the correct
      // boundary — not gridTop, which is a large number that makes this
      // condition fire immediately on every upward scroll.
      if (wrapper.scrollTop <= 0) {
        try {
          wrapper.scrollTop = 0;
        } catch (err) {
          void err;
        }

        // Switch back to virtual scroll mode
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
      {
        type: "video" as const,
        src: "/videos/collection-the-becoming-video-horizontal.mp4",
      },
      {
        type: "video" as const,
        src: "/videos/collection-the-becoming-video-vertical.mp4",
      },
      {
        type: "video" as const,
        src: "/videos/collection-the-becoming-video-vertical.mp4",
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
        { url: "/collection", title: "THE BECOMING" },
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
      url: "/shop/collection/The-Becoming",
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
              videoPosterHorizontal="/images/collection-the-becoming-video-frame-horizontal.jpg"
              videoPosterVertical="/images/collection-the-becoming-video-frame-vertical.jpg"
              videoHorizontalSrc="/videos/collection-the-becoming-video-horizontal.mp4"
              videoVerticalSrc="/videos/collection-the-becoming-video-vertical.mp4"
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
            className="min-h-svh w-full text-black gap-16 py-22 relative flex flex-col items-center text-center max-mobile:gap-10 max-mobile:pb-10 max-mobile:pt-24"
            data-header-theme="light"
          >
            <div className="gap-16 relative flex flex-col items-center text-center ">
              <div className="relative flex flex-col items-center text-center gap-6 max-w-[480px] smaller-tablet:max-tablet:max-w-[590px] max-mobile:w-full max-mobile:px-5 max-mobile:gap-4">
                <div className="font-regular p-2.5 text-2xl max-tablet:text-lg max-mobile:p-0">
                  SS26 THE BECOMING
                </div>
                <div className="text-[14px] leading-normal tracking-0 smaller-tablet:max-tablet:p-2.5 max-mobile:text-xs">
                  {/* <div>“THE BECOMING” is a woman’s journey of finding herself.</div>
                  <div>
                    The collection is the perspective reflected through the
                    mirror in which she sees her own image. This becoming is not
                    about turning into someone else, but about discovering who
                    she truly is.
                  </div> */}

                  <div>“The Becoming” is not simply a collection, but a reflection of a journey, where identity unfolds quietly through uncertainty, growth, and the courage to begin before feeling fully ready. This first collection of MEMOÍ was never about perfection, but about becoming slowly, intentionally, and truthfully, shaped by discipline, persistence, and the unseen moments in between.</div>
                </div>
              </div>
            </div>
            <div className="relative w-full">
              {[
                {
                  slice: [3, 5],
                  breakpoint: "laptop:grid hidden",
                  sizes: "(min-width: 1024px) 50vw, 0px",
                },
                {
                  slice: [5, 7],
                  breakpoint: "smaller-tablet:max-tablet:grid hidden",
                  sizes: "(min-width: 768px) and (max-width: 1023px) 50vw, 0px",
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
                          loading="lazy"
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
              Each piece embodies this transformation in motion. A balance of softness and structure, with fluid silhouettes that are delicate yet certain, minimal yet deeply considered. Designed not to change who you are, but to bring you closer to yourself to who you are becoming.
            </div>
            <div className="relative w-full">
              {[
                {
                  breakpoint: "laptop:grid hidden",
                  sizes: "(min-width: 1024px) 50vw, 0px",
                },
                {
                  breakpoint: "smaller-tablet:max-tablet:grid hidden",
                  sizes: "(min-width: 768px) and (max-width: 1023px) 50vw, 0px",
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
              More than reinvention, “The Becoming” is a return to clarity, to presence, to a deeper sense of self. Created for the modern woman who moves with quiet confidence, this collection invites you to embrace your own rhythm and step into each moment with ease because not everything needs to be loud to be seen. Some things arrive softly.
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
                  url={`${exampleWithLinks.heroDetail.url}`}
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
