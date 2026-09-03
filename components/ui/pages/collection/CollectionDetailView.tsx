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
import type { CollectionDetail } from "@/constants/collections";
import { useProductPaginatedByCollectionQuery } from "@/queries/useProductPaginatedByCollectionQuery";

const RESPONSIVE_GRIDS = [
  {
    key: "desktop",
    breakpoint: "laptop:grid hidden",
    sizes: "(min-width: 1024px) 50vw, 0px",
  },
  {
    key: "tablet",
    breakpoint: "smaller-tablet:max-tablet:grid hidden",
    sizes: "(min-width: 768px) and (max-width: 1023px) 50vw, 0px",
  },
  {
    key: "mobile",
    breakpoint: "max-mobile:grid hidden",
    sizes: "(max-width: 767px) 50vw, 0px",
  },
] as const;

const SLIDESHOW_BREAKPOINTS = [
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
] as const;

type CollectionDetailViewProps = {
  collection: CollectionDetail;
};

function CollectionDetailView({ collection }: CollectionDetailViewProps) {
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);

  const heroSectionRef = useRef<HTMLDivElement>(null);
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

  const { data: productsData } = useProductPaginatedByCollectionQuery({
    collection_name: collection.shopCollectionName,
    page_number: 1,
    page_limit: 1,
  });

  const numberOfItems = productsData?.total_products ?? 0;

  const getSections = useCallback(() => {
    return [heroSectionRef.current, gridSectionRef.current].filter(
      Boolean
    ) as HTMLElement[];
  }, []);

  useEffect(() => {
    let lastTime: number | null = null;

    const animate = (timestamp: number) => {
      const sections = getSections();
      if (sections.length === 0) return;

      if (lastTime === null) lastTime = timestamp;
      const deltaTime = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      const clampedDelta = Math.min(deltaTime, 0.1);

      const dist = Math.abs(targetYRef.current - currentYRef.current);

      if (dist < 1) {
        isSettlingRef.current = false;
        if (currentIndexRef.current === sections.length - 1) {
          setIsAtBottom(true);
        }
      }

      const lerpFactor =
        1 - Math.pow(1 - LERP_FACTOR, clampedDelta * NORMALIZED_DELTA);
      currentYRef.current +=
        (targetYRef.current - currentYRef.current) * lerpFactor;

      if (smoothContentRef.current) {
        smoothContentRef.current.style.transform = `translate3d(0, ${-currentYRef.current}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [getSections]);

  const onScrollInput = useCallback(
    (deltaY: number) => {
      if (isSettlingRef.current) return;
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
    },
    [getSections]
  );

  useEffect(() => {
    const wheelHandler = (e: WheelEvent) => {
      if (
        typeof document !== "undefined" &&
        document.body.classList.contains("menu-open")
      ) {
        e.preventDefault();
        return;
      }

      const gridEl = gridSectionRef.current;

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

  useEffect(() => {
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (
        typeof document !== "undefined" &&
        document.body.classList.contains("menu-open")
      ) {
        e.preventDefault();
        return;
      }

      if (isAtBottom) {
        const currentY = e.touches[0].clientY;
        const deltaY = startY - currentY;
        const isScrollingUp = deltaY < 0;
        const pageScrollTop =
          window.scrollY || document.documentElement.scrollTop || 0;

        if (isScrollingUp && pageScrollTop <= 1) {
          e.preventDefault();
          window.scrollTo(0, 0);
          setIsAtBottom(false);
        }
        return;
      }

      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      if (Math.abs(deltaY) < 5) return;

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
            startY = currentY;
            return;
          }
        }
      }

      const isScrollingUp = deltaY < 0;
      const isAtFirstSection = currentIndexRef.current === 0;

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

  useEffect(() => {
    if (!isAtBottom) return;

    const wrapper = smoothWrapperRef.current;
    const content = smoothContentRef.current;
    if (!wrapper || !content) return;

    const sections = [heroSectionRef.current, gridSectionRef.current].filter(
      Boolean
    ) as HTMLElement[];

    const lastIndex = sections.length - 1;

    const onWrapperScroll = () => {
      if (wrapper.scrollTop <= 0) {
        try {
          wrapper.scrollTop = 0;
        } catch (err) {
          void err;
        }

        setIsAtBottom(false);

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

  const carouselItems = [...collection.slider, ...collection.slider].map(
    (src, index) => (
      <GridImageItem key={`${src}-${index}`} src={src} alt="Slider image" />
    )
  );

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
          <div ref={heroSectionRef} className="h-svh" data-header-theme="dark">
            <HeroSection
              ref={heroSectionRef}
              media={collection.hero.desktop}
              tabletMedia={collection.hero.tablet}
              mobileMedia={collection.hero.mobile}
            >
              <CollectionHeroDetail
                id={collection.season}
                title={collection.name}
                numberOfItems={numberOfItems}
                urlTitle={collection.shopLinkTitle}
                url={collection.shopUrl}
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
                  {collection.intro.heading}
                </div>
                <div className="text-[14px] leading-normal tracking-0 smaller-tablet:max-tablet:p-2.5 max-mobile:text-xs">
                  <div>{collection.intro.body}</div>
                </div>
              </div>
            </div>

            <div className="relative w-full">
              {RESPONSIVE_GRIDS.map(({ key, breakpoint, sizes }) => (
                <div key={key} className={`grid grid-cols-2 gap-2.5 ${breakpoint}`}>
                  {collection.campaignGrid[key].map((media, index) => (
                    <div
                      key={index}
                      className="relative w-full aspect-8/9 max-tablet:aspect-2/3"
                    >
                      <Image
                        src={media.src}
                        fill
                        loading="lazy"
                        sizes={sizes}
                        alt={`${collection.name} campaign ${index + 1}`}
                        className="object-cover object-center"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="text-center max-w-[500px] p-2.5 mx-auto text-[14px] leading-normal tracking-0  max-mobile:w-full max-mobile:px-5 max-mobile:text-xs ">
              {collection.midSection}
            </div>

            <div className="relative w-full">
              {SLIDESHOW_BREAKPOINTS.map(({ breakpoint, sizes }, gridIndex) => (
                <div key={gridIndex} className={`${breakpoint}`}>
                  <div className="relative w-1/3 mx-auto aspect-auto smaller-tablet:max-tablet:w-3/5 max-mobile:w-2/3">
                    <CollectionImageShowSlide
                      sizes={sizes}
                      images={collection.slideShow}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center max-w-[500px] p-2.5 mx-auto text-[14px] leading-normal tracking-0 smaller-tablet:max-tablet:max-w-[590px] max-mobile:w-full max-mobile:px-5 max-mobile:text-xs">
              {collection.closingSection}
            </div>

            <div className="w-full flex flex-col gap-10 max-mobile:gap-6">
              <div className="w-full">
                <Carousel
                  items={carouselItems}
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
                  url={collection.shopUrl}
                  title={collection.shopLinkTitle}
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

export default CollectionDetailView;
