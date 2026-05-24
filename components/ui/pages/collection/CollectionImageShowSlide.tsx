"use client";

import { useState } from "react";
import Image from "next/image";
import ChevronLeftIcon from "../../atoms/ChevronLeftIcon";
import ChevronRightIcon from "../../atoms/ChevronRightIcon";

type CollectionImageShowSlideProps = {
  images: string[];
  sizes?: string;
};

function CollectionImageShowSlide({
  images,
  sizes,
}: CollectionImageShowSlideProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsLoaded(false);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsLoaded(false);
    }
  };

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === images.length - 1;

  return (
    <div className="relative w-full h-full flex flex-col gap-8 max-mobile:gap-4">
      {/* Image Container */}
      {/* <div className="relative h-full"> */}
      <div
        className={`relative w-full transition-colors ${
          !isLoaded ? "animate-pulse bg-neutral-100" : ""
        }`}
      >
        <Image
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1} of ${images.length}`}
          width={800}
          height={1000}
          sizes={sizes ?? "100vw"}
          className={`relative h-auto w-full object-contain transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          priority={currentIndex === 0}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
      {/* </div> */}

      {/* Controls */}
      <div className="relative inset-0 flex items-center justify-center gap-5">
        {/* Left Chevron */}
        <button
          onClick={goToPrevious}
          disabled={isFirst}
          className={`transition-opacity ${isFirst ? "opacity-20 cursor-not-allowed" : "cursor-pointer opacity-100"
            }`}
          aria-label="Previous image"
        >
          <ChevronLeftIcon />
        </button>

        {/* Pagination Info */}
        <div className="font-regular text-[16px] max-mobile:text-sm">
          {currentIndex + 1}/{images.length}
        </div>

        {/* Right Chevron */}
        <button
          onClick={goToNext}
          disabled={isLast}
          className={`transition-opacity ${isLast ? "opacity-20 cursor-not-allowed" : "cursor-pointer opacity-100"
            }`}
          aria-label="Next image"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}

export default CollectionImageShowSlide;
