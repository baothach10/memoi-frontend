"use client";

import GridImageItem from "@/components/ui/pages/collection/GridImageItem";
import SignInCarousel from "@/components/ui/pages/sign-in/SignInCarousel";
import SignInPortal from "@/components/ui/pages/sign-in/SignInPortal";
import useIsMobile from "@/hooks/useIsMobile";

function SignInPage() {
  const isMobile = useIsMobile();
  const exampleWithLinks = {
    slider: [
      {
        type: "image" as const,
        src: "/images/authentication-slider-1.webp",
      },
      {
        type: "image" as const,
        src: "/images/authentication-slider-2.webp",
      },
      {
        type: "image" as const,
        src: "/images/authentication-slider-3.webp",
      },
    ],
  };
  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-[#fffefa] text-black overflow-hidden">
      <SignInPortal />


      <div className="relative w-1/2 h-full max-tablet:hidden">
        <SignInCarousel
          items={[
            <GridImageItem
              key={1}
              src={exampleWithLinks.slider[0].src}
              alt={`Slider image`}
              fillHeight={true}
            />,
            <GridImageItem
              key={2}
              src={exampleWithLinks.slider[1].src}
              alt={`Slider image`}
              fillHeight={true}
            />,
            <GridImageItem
              key={3}
              src={exampleWithLinks.slider[2].src}
              alt={`Slider image`}
              fillHeight={true}
            />,
          ]}
          slidesPerView={1}
          spaceBetween={10}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={1800}
        />
      </div>
    </div>
  );
}

export default SignInPage;
