"use client"

import React from 'react'
// Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
// Styles (ts may not have types for these side-effect imports)
// @ts-expect-error - side-effect CSS import may not have TS types
import 'swiper/css'
// @ts-expect-error - side-effect CSS import may not have TS types
import 'swiper/css/autoplay'

type CarouselProps = {
    items: React.ReactNode[]
    /** If provided, sets a fixed slidesPerView. If omitted, breakpoints are used. */
    slidesPerView?: number
    /** space between slides in px */
    spaceBetween?: number
    loop?: boolean
    /** Swiper speed in ms */
    speed?: number
    /** autoplay config: boolean to use defaults or provide partial config */
    autoplay?: boolean | { delay?: number; disableOnInteraction?: boolean; pauseOnMouseEnter?: boolean }
    /** Optional responsive breakpoints (swiper format) */
    breakpoints?: { [width: number]: { slidesPerView: number; spaceBetween?: number } }
    className?: string
}

export default function Carousel({
    items,
    slidesPerView,
    spaceBetween = 12,
    loop = true,
    speed = 2000,
    autoplay = true,
    breakpoints,
    className = ''
}: CarouselProps) {
    const autoplayCfg = React.useMemo(() => {
        if (!autoplay) return false
        if (typeof autoplay === 'boolean') {
            return { delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }
        }
        return {
            delay: autoplay.delay ?? 2500,
            disableOnInteraction: autoplay.disableOnInteraction ?? false,
            pauseOnMouseEnter: autoplay.pauseOnMouseEnter ?? true
        }
    }, [autoplay])

    if (!items || items.length === 0) return null

    // sensible default breakpoints when none provided
    const defaultBreakpoints = breakpoints ?? {
        0: { slidesPerView: 2, spaceBetween },
        640: { slidesPerView: 4, spaceBetween },
        1024: { slidesPerView: 6, spaceBetween },
        1280: { slidesPerView: 8, spaceBetween }
    }

    return (
        <div className={className}>
            <Swiper
                modules={[Autoplay]}
                loop={loop}
                autoplay={autoplayCfg}
                speed={speed}
                allowTouchMove={true}
                grabCursor={true}
                slidesPerView={slidesPerView}
                spaceBetween={spaceBetween}
                breakpoints={slidesPerView ? undefined : defaultBreakpoints}
            >
                {items.map((item, i) => (
                    <SwiperSlide key={i}>
                        {item}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}