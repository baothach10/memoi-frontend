"use client";
import { LinkItem } from "@/components/ui/atoms/LinkItem";
import HeroSection from "@/components/ui/pages/home/HeroSection";

// Main Home Component
export default function ContactUsPage() {
  const exampleWithLinks = {
    media: {
      type: "image" as const,
      src: "/images/explore-menu.webp",
    },
    tabletMedia: {
      type: "image" as const,
      src: "/images/explore-menu.webp",
    },
    mobileMedia: {
      type: "image" as const,
      src: "/images/explore-menu.webp",
    },
  };

  const itemsList = [
    {
      title: "About us",
      href: "/explore/about-us",
    },
    {
      title: "The MEMOÍ House",
      href: "/the-memoi-house",
    },
    {
      title: "Our Commitments",
      href: "/explore/commitments",
    },
    {
      title: "Contact us",
      href: "/explore/contact-us",
    },
  ];

  return (
    <div className="relative">
      <div className={`h-screen overflow-hidden`}>
        <div className="bg-[#fffefa]">
          <div className="h-screen" data-header-theme="dark">
            <HeroSection
              ref={null}
              media={exampleWithLinks.media}
              tabletMedia={exampleWithLinks.tabletMedia}
              mobileMedia={exampleWithLinks.mobileMedia}
            >
              <div className="text-white gap-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                <div className="gap-3 flex flex-col items-center justify-center relative">
                  {itemsList.map((item, idx) => (
                    <LinkItem
                      key={`${item.title}-${idx}`}
                      url={item.href}
                      title={item.title}
                      style="relative inline-flex text-[16px] leading-[18px] relative after:absolute after:left-0 after:-bottom-px after:h-px after:w-full after:origin-left after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100 after:bg-white/40"
                    />
                  ))}
                </div>
              </div>
            </HeroSection>
          </div>
        </div>
      </div>
    </div>
  );
}
