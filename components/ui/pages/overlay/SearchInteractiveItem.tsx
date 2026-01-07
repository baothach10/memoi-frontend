"use client";

import { useState } from "react";
import Image from "next/image";

interface ShopInteractiveItemProps {
  image: string;
  hoveredImage: string;
  name: string;
  currency: string;
  price: number;
}

export default function SearchInteractiveItem({
  image,
  hoveredImage,
  name,
  currency,
  price,
}: ShopInteractiveItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center bg-linear-to-b from-[#fffefa] via-black/2 to-[#fffefa]">
      {[
        {
          breakpoint: "laptop:grid hidden",
          sizes: "(min-width: 1025px) 50vw, 0px",
        },
        {
          breakpoint: "smaller-tablet:max-tablet:grid hidden",
          sizes: "(min-width: 768px) and (max-width: 1024px) 50vw, 0px",
        },
        {
          breakpoint: "max-mobile:grid hidden",
          sizes: "(max-width: 767px) 50vw, 0px",
        },
      ].map(({ breakpoint, sizes }, gridIndex) => (
        <div
          key={gridIndex}
          className={`relative w-full aspect-3/4 overflow-hidden cursor-pointer ${breakpoint}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={image}
            alt={name}
            fill
            loading="eager"
            sizes={sizes}
            className={`object-cover transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-100"
              }`}
          />
          <Image
            src={hoveredImage}
            alt={`${name} - hovered`}
            fill
            loading="eager"
            sizes={sizes}
            className={`object-cover transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
              }`}
          />
        </div>
      ))}

      <div className="flex flex-col items-center mt-4 w-full gap-2">
        <h3 className="text-center font-regular text-[14px]">{name}</h3>
        <div className="flex flex-row items-center text-xs">
          <span className="mr-1">{currency}</span>
          <span>{price.toFixed(2)}</span>
        </div>
      </div>
    </div >
  );
}
