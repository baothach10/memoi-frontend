"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

interface MobileImageCarouselProps {
  images: string[];
}

export default function MobileImageCarousel({
  images,
}: MobileImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full flex flex-col pb-6 bg-linear-to-r from-[#fffefa] via-black/2 to-[#fffefa] max-mobile:pb-5">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        onSlideChange={handleSlideChange}
        allowTouchMove={true}
        grabCursor={true}
        className="w-full "
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full aspect-4/5 max-mobile:aspect-3/4">
              <Image
                src={src}
                alt={`Product image ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100%"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Slide counter */}
      <div className="text-center text-[16px] font-regular text-black max-mobile:mt-3 mt-5 max-mobile:text-xs">
        {activeIndex + 1}/{images.length}
      </div>
    </div>
  );
}
