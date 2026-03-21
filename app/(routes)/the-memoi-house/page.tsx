'use client'
import Footer from "@/components/ui/organisms/Footer";
import HeroSection from "@/components/ui/pages/home/HeroSection";
import useIsMobile from "@/hooks/useIsMobile";
import { useRef, useState, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import BenefitTable from "@/components/ui/pages/help/BenefitTable";

function TheMemoiHousePage() {
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
            // but prevent pull-to-refresh when wrapper is scrolled to the top
            if (isAtBottom) {
                const wrapper = smoothWrapperRef.current;
                const currentY = e.touches[0].clientY;
                const deltaY = startY - currentY;
                const isScrollingUp = deltaY < 0;

                // When wrapper is at the very top and user swipes up,
                // prevent default to block pull-to-refresh
                if (wrapper && wrapper.scrollTop <= 0 && isScrollingUp) {
                    e.preventDefault();
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

    return (
        <div className="relative w-full h-full bg-[#fffefa]">
            <div
                ref={smoothWrapperRef}
                className={`h-screen ${isAtBottom ? "" : "overflow-hidden"} `}
                style={{
                    overscrollBehaviorY:
                        currentSectionIndex === 0 && !isAtBottom ? "auto" : "contain",
                }}
            >
                <div ref={smoothContentRef} className="bg-[#fffefa]">
                    <div
                        ref={heroSection1Ref}
                        className="h-screen"
                        data-header-theme="dark"
                    >
                        <HeroSection
                            ref={heroSection1Ref}
                            media={{ type: "image" as const, src: '/images/the-memoi-house.webp' }}
                            tabletMedia={{ type: "image" as const, src: '/images/the-memoi-house.webp' }}
                            mobileMedia={{ type: "image" as const, src: '/images/the-memoi-house.webp' }}
                            desktopImageClassName={"object-[0_80%]"}
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-auto max-w-[720px] text-center flex flex-col gap-12 justify-center items-center max-mobile:w-full max-mobile:px-5">
                                <div className="flex flex-col gap-8 justify-center items-center text-white">
                                    <div>
                                        <div className="text-2xl font-regular leading-[140%] max-mobile:text-lg">
                                            <h2>WELCOME HOME TO THE</h2>
                                            <h2>HOUSE OF MEMOÍ</h2>
                                        </div>
                                        <div className="text-xs text-white/80 mt-1">Where every woman finds her reflection</div>
                                    </div>
                                    <div className="text-sm leading-normal space-y-2 max-mobile:text-xs">
                                        <div>
                                            Welcome to The MEMOÍ House, our exclusive client collective where sophisticated belonging meets conscious elegance. More than a membership, the House is where we recognize and reward your commitment, granting you access to special discounts, personalized services, and priority access to new collections and events.
                                        </div>
                                        <div className="font-regular">
                                            Your place in our exclusive community awaits. Welcome home!
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="
                                        px-10 py-4
                                        border border-white/80
                                        text-white
                                        text-sm
                                        tracking-[0.12em]
                                        bg-transparent
                                        transition-all
                                        duration-500
                                        ease-out
                                        hover:bg-white
                                        hover:text-black
                                        hover:border-white
                                        max-mobile:text-xs
                                    "
                                >
                                    Join The MEMOÍ House
                                </button>
                            </div>
                        </HeroSection>
                    </div>

                    <section
                        ref={gridSectionRef}
                        className="min-h-screen w-full text-black gap-16 py-20 relative flex flex-col items-center max-mobile:gap-10 max-mobile:pb-10 max-mobile:pt-10"
                        data-header-theme="light"
                    >
                        <div className="relative h-full max-w-[904px] px-10 space-y-16 max-mobile:px-5 max-mobile:space-y-8">
                            <div className="space-y-20 max-mobile:space-y-8">
                                <div className="text-center space-y-2">
                                    <h2 className="font-regular uppercase text-2xl max-mobile:text-lg">Benefits for House Members</h2>
                                    <p className="text-[16px] leading-[140%] max-mobile:text-sm">Your status within The MEMOÍ House is a measure of your continued relationship with the brand, determined by your total accumulated spending over time.</p>
                                </div>
                                <div>
                                    <BenefitTable />
                                </div>
                            </div>
                            <div className="space-y-12 border-t pt-8 border-t-black/10 max-mobile:space-y-6 max-mobile:pt-6">

                                <div className="space-y-4">
                                    <h3 className="uppercase text-[16px] max-mobile:text-sm">
                                        How to Qualify
                                    </h3>
                                    <div className="space-y-2 text-sm max-mobile:text-xs">
                                        <p className="">Exclusive membership tiers are achieved when your cumulative spending reaches the required threshold:</p>
                                        <ul className="list-['-_'] list-inside space-y-2">
                                            <li><span className="font-regular">MEMOÍ +:</span> Achieve S$3,000 in accumulated spending.</li>
                                            <li><span className="font-regular">MEMOÍ ELITE:</span> Achieve S$8,000 in accumulated spending.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="uppercase text-[16px] max-mobile:text-sm">
                                        Status Maintenance and Validity
                                    </h3>
                                    <div className="space-y-2 text-sm max-mobile:text-xs">
                                        <p className="">To ensure the best experience and extend membership benefits, your status is tied to a rolling 6-month period from the date of your last purchase.</p>
                                        <ul className="list-['-_'] list-inside space-y-2">
                                            <li><span className="font-regular">Validity Period:</span> Your privileges are active for 6 months after your last transaction.</li>
                                            <li><span className="font-regular">Maintenance & Upgrade:</span> To maintain your current status or upgrade to the next level, you must generate sufficient new spending within this 6-month period.</li>
                                            <li><span className="font-regular">Extension:</span> Every new purchase you make automatically extends your 6-month validity period.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default TheMemoiHousePage