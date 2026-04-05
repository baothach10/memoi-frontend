"use client";
import useIsMobile from "@/hooks/useIsMobile";

import ThreeScene from "@/components/ui/organisms/ThreeScene";
import Logo from "@/components/ui/molecules/Logo";
import Carousel from "@/components/ui/molecules/Carousel";
import GridHyperImageItem from "@/components/ui/pages/home/GridHyperImageItem";
import Footer from "@/components/ui/organisms/Footer";

// Main Home Component
export default function AboutUsPage() {
  const isMobile = useIsMobile(1024);
  const isLargeTablet = useIsMobile(1200);

  return (
    <div className={`min-h-screen relative w-full bg-[#fffefa]`}>
      <section
        className="min-h-screen h-full w-full text-black pt-36 gap-[100px] relative flex flex-col items-center text-center smaller-tablet:max-tablet:pb-20 smaller-tablet:max-tablet:gap-16 max-mobile:gap-10 max-mobile:pt-24 max-mobile:pb-10"
        data-header-theme="light"
      >
        <div className="relative w-2/3 flex flex-col items-center text-center max-mobile:w-full max-mobile:px-4">
          <div className="relative uppercase leading-[140%] text-2xl laptop:max-desktop:w-2/5 desktop:w-1/4 font-regular max-tablet:w-3/5 max-mobile:text-[18px] max-mobile:leading-[120%] max-mobile:w-4/5">
            MEMOÍ - for the woman becoming herself
          </div>

          <div className="relative w-[680px] h-[470px] laptop:max-desktop:w-[780px] laptop:max-desktop:h-[470px] smaller-tablet:max-tablet:w-[488px] smaller-tablet:max-tablet:h-[348px] max-mobile:w-[355px] max-mobile:h-[255px]">
            <ThreeScene />
          </div>
          <div className="relative w-full flex flex-col gap-10 pt-16 max-mobile:pt-6 max-mobile:gap-6">
            <div className="flex flex-col items-center gap-3">
              <div>
                <Logo />
              </div>
              <div className="text-xs leading-[18px]">since 2025</div>
            </div>
            <div className="text-center space-y-2 leading-[150%] text-sm mx-auto max-w-[778px] smaller-tablet:max-tablet:max-w-[522px] max-mobile:text-xs">
              <div>
                Empowering Quiet Elegance, Timeless Transformation - To inspire
                customers to embrace a confidently chic and elegant lifestyle -
                expressing individuality, independence, and femininity with
                quiet power.
              </div>
              <div>
                Founded in 2025. MEMOÍ was born from a
                simple yet powerful belief: every woman deserves to feel
                beautiful, confident, and true to herself—every single day.
              </div>
              <div>
                MEMOÍ - An affordable luxury fashion house dedicated to the
                modern, independent woman - one who embraces her femininity with
                confidence and grace. Rooted in the art of self-expression, our
                creations marry timeless sophistication with effortless comfort,
                redefining contemporary elegance.
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full">
          <Carousel
            items={[
              <GridHyperImageItem
                key={1}
                src="/images/about-us-production-1.webp"
                href="https://www.instagram.com/memoi.official/"
              />,
              <GridHyperImageItem
                key={2}
                src="/images/about-us-production-2.webp"
                href="https://www.instagram.com/memoi.official/"
              />,
              <GridHyperImageItem
                key={3}
                src="/images/about-us-production-3.webp"
                href="https://www.instagram.com/memoi.official/"
              />,
              <GridHyperImageItem
                key={4}
                src="/images/about-us-production-4.webp"
                href="https://www.instagram.com/memoi.official/"
              />,
              <GridHyperImageItem
                key={5}
                src="/images/about-us-production-1.webp"
                href="https://www.instagram.com/memoi.official/"
              />,
              <GridHyperImageItem
                key={6}
                src="/images/about-us-production-2.webp"
                href="https://www.instagram.com/memoi.official/"
              />,
              <GridHyperImageItem
                key={7}
                src="/images/about-us-production-3.webp"
                href="https://www.instagram.com/memoi.official/"
              />,
              <GridHyperImageItem
                key={8}
                src="/images/about-us-production-4.webp"
                href="https://www.instagram.com/memoi.official/"
              />,
            ]}
            slidesPerView={isMobile ? 2 : isLargeTablet ? 3 : 4}
            spaceBetween={10}
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={1800}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
