import Footer from "@/components/ui/organisms/Footer";
import Link from "next/link";
import { forwardRef } from "react";
import Carousel from '@/components/ui/molecules/Carousel'
import GridHyperImageItem from './GridHyperImageItem'
import BenefitItem from "./BenefitItem";
import useIsMobile from "@/hooks/useIsMobile";

const GridSectionWithFooter = forwardRef<HTMLElement>((props, ref) => {
  const isMobile = useIsMobile(1024);
  const isLargeTablet = useIsMobile(1200);
  return (
    <section
      ref={ref}
      className="min-h-svh w-full relative flex flex-col bg-[#fffefa]"
      data-header-theme="light"
    >
      <div className="relative h-full w-full flex flex-col justify-around">

        <div className="flex flex-col items-center text-center text-black gap-3 pt-24 pb-8 max-mobile:text-sm max-mobile:gap-2 max-mobile:pt-24 max-mobile:pb-6">
          <span className="uppercase text-2xl leading-none font-regular max-mobile:text-sm">Follow us on Instagram</span>
          <span>
            <Link
              href={"https://www.instagram.com/memoi.official/"}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              @memoi.official
            </Link>
          </span>
        </div>
        <div className="w-full">
          <Carousel
            items={[
              <GridHyperImageItem key={1} src="/images/instagram-post-1.webp" href="https://www.instagram.com/memoi.official/" />,
              <GridHyperImageItem key={2} src="/images/instagram-post-2.webp" href="https://www.instagram.com/memoi.official/" />,
              <GridHyperImageItem key={3} src="/images/instagram-post-3.webp" href="https://www.instagram.com/memoi.official/" />,
              <GridHyperImageItem key={4} src="/images/instagram-post-4.webp" href="https://www.instagram.com/memoi.official/" />,
              <GridHyperImageItem key={5} src="/images/instagram-post-1.webp" href="https://www.instagram.com/memoi.official/" />,
              <GridHyperImageItem key={6} src="/images/instagram-post-2.webp" href="https://www.instagram.com/memoi.official/" />,
              <GridHyperImageItem key={7} src="/images/instagram-post-3.webp" href="https://www.instagram.com/memoi.official/" />,
              <GridHyperImageItem key={8} src="/images/instagram-post-4.webp" href="https://www.instagram.com/memoi.official/" />
            ]}
            slidesPerView={isMobile ? 2 : (isLargeTablet ? 3 : 4)}
            spaceBetween={10}
            autoplay={{ delay: 1000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            speed={1800}
          />
        </div>
        <div className="px-25 py-16 smaller-tablet:max-tablet:px-10 smaller-tablet:max-tablet:py-0 smaller-tablet:max-tablet:pt-16 max-mobile:px-5 max-mobile:py-10">
          <div className={`flex items-center max-tablet:flex-col`}>
            <Link href={'/help?tab=shipping'} className="block flex-1 smaller-tablet:max-tablet:w-full cursor-pointer">
              <BenefitItem
                className="smaller-tablet:max-tablet:w-full smaller-tablet:max-tablet:py-4 smaller-tablet:max-tablet:justify-between max-mobile:py-3"
                image="Shipping Icon"

                title="Free Delivery & Exchanges"
                description="Complimentary standard shipping and returns & exchanges within 30 days"
              />
            </Link>

            <div className="laptop:max-desktop:w-px max-tablet:h-px bg-gray-200 self-stretch max-mobile:my-[5px]" />

            <Link href={'/help?tab=orders'} className="block flex-1 smaller-tablet:max-tablet:w-full cursor-pointer">
              <BenefitItem
                className="smaller-tablet:max-tablet:w-full smaller-tablet:max-tablet:py-4 smaller-tablet:max-tablet:justify-between max-mobile:py-3"
                image="Payment Icon"
                title="Secure Payment & Information"
                description="Your payment and information details are encrypted and securely processed"
              />
            </Link>

            <div className="laptop:max-desktop:w-px max-tablet:h-px bg-gray-200 self-stretch max-mobile:my-[5px]" />

            <Link href={'/help?tab=house'} className="block flex-1 smaller-tablet:max-tablet:w-full cursor-pointer">
              <BenefitItem
                className="smaller-tablet:max-tablet:w-full smaller-tablet:max-tablet:py-4 smaller-tablet:max-tablet:justify-between max-mobile:py-3"
                image="Check Icon"
                title="The MEMOÍ Membership"
                description="Your MEMOÍ membership elevates your experience with tier rewards"
              />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    </section>
  );
});

GridSectionWithFooter.displayName = "GridSectionWithFooter";

export default GridSectionWithFooter;
