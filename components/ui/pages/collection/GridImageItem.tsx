import { useEffect, useState } from "react";
import Image from "next/image";
import useIsMobile from "@/hooks/useIsMobile";

type Props = {
  src: string;
  href?: string;
  alt?: string;
  className?: string;
  fillHeight?: boolean; // Add prop to control whether to fill height or use aspect ratio
};

export default function GridImageItem({
  src,
  alt = "Instagram image",
  className = "",
  fillHeight = false,
}: Props) {
  const [ratios, setRatios] = useState<string>("5/6");
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile(1024);

  useEffect(() => {
    if (fillHeight) return; // Skip aspect ratio calculation if fillHeight is true

    const updateRatio = () => {
      const width = document.documentElement.clientWidth;
      if (width >= 1440) {
        // laptop and desktop
        setRatios("3/4");
      } else if (width >= 1000 && width < 1200) {
        // ipad pro
        setRatios("5/7");
      } else if (width > 767) {
        setRatios("5/6");
      } else {
        setRatios("5/7");
      }
    };
    updateRatio();
    window.addEventListener("resize", updateRatio);
    return () => window.removeEventListener("resize", updateRatio);
  }, [fillHeight]);

  return (
    <div
      className={`relative w-full group ${fillHeight ? "h-full" : ""} ${className} ${
        !isLoaded ? "animate-pulse bg-neutral-100" : ""
      }`}
      style={!fillHeight ? { aspectRatio: ratios } : undefined}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100%"
        className={`object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
