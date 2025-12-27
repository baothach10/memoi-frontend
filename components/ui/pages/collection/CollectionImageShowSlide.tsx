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

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === images.length - 1;

  return (
    <div className="relative w-full h-full flex flex-col gap-8 max-mobile:gap-4">
      {/* Image Container */}
      <div className="relative flex-1 w-full aspect-4/5 h-full">
        <Image
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1} of ${images.length}`}
          fill
          sizes={sizes ?? "100vw"}
          className="object-cover object-center "
          priority={currentIndex === 0}
        />
      </div>

      {/* Controls */}
      <div className="relative inset-0 flex items-center justify-center">
        {/* Left Chevron */}
        <button
          onClick={goToPrevious}
          disabled={isFirst}
          className={`p-2 transition-opacity ${isFirst ? "opacity-20 cursor-not-allowed" : "opacity-100"
            }`}
          aria-label="Previous image"
        >
          <ChevronLeftIcon />
        </button>

        {/* Pagination Info */}
        <div className="font-regular">
          {currentIndex + 1}/{images.length}
        </div>

        {/* Right Chevron */}
        <button
          onClick={goToNext}
          disabled={isLast}
          className={`p-2 transition-opacity ${isLast ? "opacity-20 cursor-not-allowed" : "opacity-100"
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
