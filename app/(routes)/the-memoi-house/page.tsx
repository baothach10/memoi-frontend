'use client'
import Footer from "@/components/ui/organisms/Footer";
import HeroSection from "@/components/ui/pages/home/HeroSection";
import useIsMobile from "@/hooks/useIsMobile";
import { useRef, useState, useCallback, useEffect } from "react";
import BenefitTable from "@/components/ui/pages/help/BenefitTable";
import Link from "next/link";
import { LERP_FACTOR } from "@/constants";

function TheMemoiHousePage() {
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
        const animate = () => {
            const sections = getSections();
            if (sections.length === 0) return;

            const now = Date.now();
            const dist = Math.abs(targetYRef.current - currentYRef.current);

            // Only release the lock if we are close to target AND user has stopped scrolling (silence period)
            if (dist < 1 && now - lastWheelTimeRef.current > 150) {
                isSettlingRef.current = false;

                // If we settled on the last section, enable native scroll MODE
                if (currentIndexRef.current === sections.length - 1) {
                    setIsAtBottom(true);
                }
            }

            // LERP calculation
            currentYRef.current += (targetYRef.current - currentYRef.current) * LERP_FACTOR;

            // Apply transform
            if (smoothContentRef.current) {
                smoothContentRef.current.style.transform = `translate3d(0, ${-currentYRef.current}px, 0)`;
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [getSections, LERP_FACTOR]);

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
    }, [isAtBottom]);

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
    }, [isAtBottom]);

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
                                <Link
                                    href="/sign-in"
                                    className="
                                        px-10 py-4
                                        border border-white/80
                                        text-white
                                        text-sm
                                        cursor-pointer
                                        bg-transparent
                                        max-mobile:text-xs
                                        max-mobile:py-3
                                        max-mobile:px-8
                                    "
                                >
                                    Join The MEMOÍ House
                                </Link>
                            </div>
                        </HeroSection>
                    </div>

                    <section
                        ref={gridSectionRef}
                        className="min-h-svh w-full text-black gap-16 py-22 relative flex flex-col items-center max-mobile:gap-10 max-mobile:pb-10 max-mobile:pt-24"
                        data-header-theme="light"
                    >
                        <div className="relative h-full max-w-[904px] px-10 space-y-16 max-mobile:px-5 max-mobile:space-y-10">
                            <div className="space-y-20 max-mobile:space-y-10">
                                <div className="text-center space-y-4">
                                    <h2 className="font-regular uppercase text-2xl max-mobile:text-lg">Benefits for House Members</h2>
                                    <p className="text-sm leading-[140%] max-mobile:text-xs">Your status within The MEMOÍ House is a measure of your continued relationship with the brand, determined by your total accumulated spending over time.</p>
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
                                        <p >Exclusive membership tiers are achieved when your cumulative spending reaches the required threshold:</p>
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
                                        <p >To ensure the best experience and extend membership benefits, your status is tied to a rolling 6-month period from the date of your last purchase.</p>
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