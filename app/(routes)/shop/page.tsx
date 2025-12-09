import HeroSection from "@/components/ui/pages/home/HeroSection";
import Link from "next/link";

// Main Home Component
export default function ShopPage() {
  const exampleWithLinks = {
    media: {
      type: "image" as const,
      src: "/images/shop-menu.webp",
    },
    tabletMedia: {
      type: "image" as const,
      src: "/images/shop-menu.webp",
    },
    mobileMedia: {
      type: "image" as const,
      src: "/images/shop-menu.webp",
    },
  };

  const itemsList = ["Dresses", "Tops", "Skirts", "Pants"];

  return (
    <div className="relative">
      <div id="smooth-wrapper" className="h-screen overflow-hidden">
        <div id="smooth-content">
          <HeroSection ref={null} media={exampleWithLinks.media} tabletMedia={exampleWithLinks.tabletMedia} mobileMedia={exampleWithLinks.mobileMedia} />
        </div>
        <div className="text-white gap-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
          <div className="gap-3 flex flex-col items-center justify-center">
            {itemsList.map((item) => (
              <Link href={"/shop"} key={item}>
                <div className="text-[16px] capitalize">{item}</div>
              </Link>
            ))}
          </div>
          <div className="text-[16px]">All products</div>
        </div>
      </div>
    </div>
  );
}
