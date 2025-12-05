import HeroSection from "@/components/pages/home/HeroSection";
import { Header } from "@/components/ui/organisms/Header";
import Link from "next/link";

// Main Home Component
export default function ExplorePage() {
  const exampleWithLinks = {
    media: {
      type: "video" as const,
      src: "/videos/video.mp4",
    },
    firstParameter:
      "Welcome to our amazing platform. Discover the future of innovation.",
    secondParameter: {
      url: "https://example.com/signup",
      title: "Sign Up Now",
    },
  };

  const itemsList = [
    "About us",
    "The MEMOÍ House",
    "Our Commitments",
    "Contact us",
  ];

  return (
    <div className="relative">
      <Header />
      <div id="smooth-wrapper" className="h-screen overflow-hidden">
        <div id="smooth-content">
          <HeroSection ref={null} media={exampleWithLinks.media} />
        </div>
        <div className="text-white gap-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
          <div className="gap-3 flex flex-col items-center justify-center">
            {itemsList.map((item) => (
              <Link key={item} href={"/explore"}>
                <div className="text-[16px]">{item}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
