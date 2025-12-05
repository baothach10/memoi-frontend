import Footer from "@/components/ui/organisms/Footer";
import Link from "next/link";
import React, { forwardRef } from "react";
import Carousel from '@/components/ui/molecules/Carousel'
import GridHyperImageItem from './GridHyperImageItem'
import BenefitItem from "./BenefitItem";

const GridSectionWithFooter = forwardRef<HTMLElement>((props, ref) => {

  return (
    <section
      ref={ref}
      className="h-screen w-full snap-start relative overflow-hidden flex flex-col bg-white"
    >
      <div className="relative h-full w-full flex flex-col justify-around">

        <div className="flex flex-col items-center text-center text-black text-[16px] gap-3 pt-20 pb-5">
          <span className="uppercase">Follow us on Instagram</span>
          <span>
            <Link
              href={"https://www.instagram.com/memoi.official/"}
              target="_blank"
              rel="noopener noreferrer"
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
            slidesPerView={4}
            spaceBetween={16}
            autoplay={{ delay: 1000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            speed={1800}
            className="py-6"
          />
        </div>
        <div className="px-16 py-8">
          <div className="flex items-center">
            <div className="flex-1">
              <BenefitItem
                image="/icons/shipping-icon.svg"
                imageAlt="Shipping Icon"
                title="Free Delivery & Exchanges"
                description="Complimentary standard shipping and returns & exchanges within 30 days"
              />
            </div>

            <div className="w-px bg-gray-200 self-stretch" />

            <div className="flex-1">
              <BenefitItem
                image="/icons/payment-icon.svg"
                imageAlt="Shipping Icon"
                title="Free Delivery & Exchanges"
                description="Complimentary standard shipping and returns & exchanges within 30 days"
              />
            </div>

            <div className="w-px bg-gray-200 self-stretch" />

            <div className="flex-1">
              <BenefitItem
                image="/icons/check-icon.svg"
                imageAlt="Shipping Icon"
                title="Free Delivery & Exchanges"
                description="Complimentary standard shipping and returns & exchanges within 30 days"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

GridSectionWithFooter.displayName = "GridSectionWithFooter";

export default GridSectionWithFooter;
