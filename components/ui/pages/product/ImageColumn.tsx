"use client";

import { useState } from "react";
import Image from "next/image";
import { LoaderCircle } from "lucide-react";

interface ImageColumnProps {
  images: string[];
}

function ImageItem({ src, index }: { src: string; index: number }) {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div
      className={`relative w-full h-[calc(100vh-120px)] bg-linear-to-b from-[#fffefa] via-black/2 to-[#fffefa] ${
        !isLoaded ? "animate-pulse bg-neutral-100" : ""
      }`}
    >
      {!isLoaded && (
        <div className="relative w-full h-full flex items-center justify-center">
          <LoaderCircle className="animate-spin" size={24} />
        </div>
      )}
      <Image
        src={src}
        alt={`Product image ${index + 1}`}
        fill
        priority={index === 0}
        className={`object-contain transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        sizes="100%"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

export default function ImageColumn({ images }: ImageColumnProps) {
  return (
    <div className="flex flex-col">
      {images.map((src, index) => (
        <ImageItem key={index} src={src} index={index} />
      ))}
    </div>
  );
}
