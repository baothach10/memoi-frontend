import { useEffect, useState } from "react";
import Image from "next/image";
import InstagramIcon from "../../atoms/InstagramIcon";
import useIsMobile from "@/hooks/useIsMobile";

type Props = {
  src: string;
  href?: string;
  alt?: string;
  className?: string;
};

export default function GridImageItem({
  src,
  alt = "Instagram image",
  className = "",
}: Props) {
  const [ratios, setRatios] = useState<string>("5/6");
  const isMobile = useIsMobile(1024);

  useEffect(() => {
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
  }, []);

  return (
    <div
      className={`relative w-full group ${className}`}
      style={{ aspectRatio: ratios }}
    >
      <Image src={src} alt={alt} fill sizes="100%" className="object-cover" />
      {!isMobile && (
        <div className="absolute w-full h-full flex items-center bg-black/0 hover:bg-black/40 justify-center transition-all">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <InstagramIcon color="white" width={48} height={48} />
          </div>
        </div>
      )}
    </div>
  );
}
