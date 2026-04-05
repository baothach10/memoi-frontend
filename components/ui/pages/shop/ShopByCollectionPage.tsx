"use client";

import HeroSection from "@/components/ui/pages/home/HeroSection";
import useIsMobile from "@/hooks/useIsMobile";
import { useRef, useState, useCallback, useEffect } from "react";
import Footer from "../../organisms/Footer";
import ShopCollectionHeroDetail from "./ShopHeroDetail";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useProductPaginatedByCollectionQuery } from "@/queries/useProductPaginatedByCollectionQuery";
import PaginationComponent from "../../molecules/Pagination";
import ShopInteractiveItem from "./ShopInteractiveItem";

type ShopByCollectionPageType = {
  collection: string
}

gsap.registerPlugin(ScrollToPlugin);

// Main Home Component
export default function ShopByCollectionPage({ collection }: ShopByCollectionPageType) {

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

  const PAGE_SIZE = 12;
  const [currentPage, setCurrentPage] = useState(1)
  const {
    data,
    isFetching,
    isLoading,
    isError,
  } = useProductPaginatedByCollectionQuery({
    collection_name: collection,
    page_number: currentPage,
    page_limit: PAGE_SIZE,
  });
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !topRef.current || isLoading || isFetching) return;

    gsap.to(window, {
      duration: 0.6,
      scrollTo: {
        y: topRef.current,
        offsetY: 40,
      },
      ease: "power2.in",
    });
  }, [data]);






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
        src: "/images/desktop-first-collection.webp",
      },
      {
        type: "image" as const,
        src: "/images/tablet-first-collection.webp",
      },
      {
        type: "image" as const,
        src: "/images/mobile-first-collection.webp",
      },
    ],
    heroDetail: {
      id: "SS26",
      title: "Becoming",
      numberOfItems: 10,
      urlTitle: "Shop the collection",
      url: "/shop",
    }
  };

  if (isError) return (

    <div className="relative w-full h-full bg-[#fffefa]">
      <section className="min-h-svh w-full text-black gap-16 pb-20 pt-36 relative flex flex-col items-center justify-center text-center max-mobile:gap-10 max-mobile:py-10 max-mobile:text-sm" data-header-theme="dark">
        <div>Failed to load products...</div>
      </section>
    </div>
  )

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
              <ShopCollectionHeroDetail
                id={exampleWithLinks.heroDetail.id}
                title={exampleWithLinks.heroDetail.title}
                numberOfItems={data?.total_products ? data.total_products : 0}
              />
            </HeroSection>
          </div>

          <section
            ref={gridSectionRef}
            data-header-theme="light"
            className="min-h-svh w-full text-black gap-16 pb-20 pt-36 relative flex flex-col items-center justify-center text-center max-mobile:gap-10 max-mobile:py-10 max-mobile:text-sm"
          >
            {isLoading || isFetching ? (
              <div>Loading products...</div>
            ) : (
              <>
                <div className="mx-auto text-center space-y-2">
                  <div className="text-black leading-[1.2] text-2xl max-mobile:text-sm">
                    <div className="flex flex-wrap justify-center gap-4 font-regular">
                      <div
                        className={`uppercase transition-colors decoration-white/40`}
                      >
                        {collection}
                      </div>
                    </div>
                  </div>
                  <div className="text-black/60 text-sm">
                    {data?.total_products} products
                  </div>
                </div>

                <div ref={topRef} className="absolute top-0 left-0" />
                <div className="grid grid-cols-4 gap-2.5 max-tablet:grid-cols-2 max-mobile:grid-cols-2 w-full px-2.5 smaller-tablet:max-tablet:px-10 max-mobile:px-5">
                  {data?.products.map((item) => (
                    <ShopInteractiveItem
                      key={item.product_id} id={item.product_id}

                      image={item.images[0].url}
                      hoveredImage={item.images[1].url}
                      name={item.name}
                      currency={item.currency}
                      price={item.price}
                    />
                  ))}
                </div>

                {data && data?.total_pages > 1 && (
                  <PaginationComponent
                    totalPage={data?.total_pages ?? 1}
                    page={currentPage}
                    onChange={(page) => {
                      setCurrentPage(page);
                    }}
                  />
                )}
              </>
            )}
          </section>

          <Footer />
        </div>
      </div>
    </div>
  );
}
