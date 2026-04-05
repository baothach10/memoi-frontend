"use client";

import Footer from "@/components/ui/organisms/Footer";
import GridImageItem from "@/components/ui/pages/collection/GridImageItem";

function CommitmentsPage() {
  return (
    <div className={`min-h-dvh relative w-full bg-[#fffefa]`}>
      <section
        className="min-h-dvh h-full w-full text-black pt-36 pb-32 gap-[100px] relative flex flex-col items-center text-center smaller-tablet:max-tablet:pb-20 smaller-tablet:max-tablet:gap-16 max-mobile:gap-6 max-mobile:pt-24 max-mobile:pb-10 max-mobile:px-4"
        data-header-theme="light"
      >
        <div className="relative w-full px-[100px] flex flex-col items-center gap-10 text-center max-mobile:w-full max-mobile:px-0 max-mobile:gap-4 max-tablet:gap-6 smaller-tablet:max-tablet:w-2/3 smaller-tablet:max-tablet:px-0">
          <div className="relative uppercase leading-[140%] text-2xl w-1/4 font-regular max-tablet:w-3/4 max-mobile:text-[18px] max-mobile:leading-[120%]">
            Our Commitments
          </div>
          <div className="grid grid-cols-3 gap-2.5 max-tablet:grid-cols-1 max-tablet:gap-10">
            <div className="flex flex-col gap-8 text-left max-tablet:text-center max-mobile:gap-6 smaller-tablet:max-tablet:gap-8">
              <div>
                <GridImageItem
                  src="/images/commitment-1.webp"
                  alt="Commitment 1"
                />
              </div>
              <div className="flex flex-col gap-5 max-mobile:gap-2.5 smaller-tablet:max-tablet:gap-5">
                <div className="uppercase font-regular text-[16px] max-mobile:text-sm leading-[150%]">
                  Timeless & Refined Design
                </div>
                <div className="text-sm leading-[150%] max-mobile:text-xs ">
                  At MEMOÍ, we are devoted to creating pieces that celebrate the
                  modern woman - confident, graceful, and effortlessly refined.
                  Each design embodies our belief that true luxury lies in
                  thoughtful craftsmanship, premium fabrics, and timeless
                  versatility.
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8 text-left max-tablet:text-center max-mobile:gap-6 smaller-tablet:max-tablet:gap-8">
              <div>
                <GridImageItem
                  src="/images/commitment-2.webp"
                  alt="Commitment 2"
                />
              </div>
              <div className="flex flex-col gap-5 max-mobile:gap-2.5 smaller-tablet:max-tablet:gap-5">
                <div className="uppercase font-regular text-[16px] max-mobile:text-sm leading-[150%]">
                  Ethical & Sustainable Production
                </div>
                <div className="text-sm leading-[150%] max-mobile:text-xs ">
                  We are committed to ethical production, ensuring that every
                  garment is made with respect - for the people behind the craft
                  and for the world we live in. From responsibly sourced materials
                  to fair working environments, sustainability is woven into the
                  fabric of everything we do.
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8 text-left max-tablet:text-center max-mobile:gap-6 smaller-tablet:max-tablet:gap-8">
              <div>
                <GridImageItem
                  src="/images/commitment-3.webp"
                  alt="Commitment 3"
                />
              </div>
              <div className="flex flex-col gap-5 max-mobile:gap-2.5 smaller-tablet:max-tablet:gap-5">
                <div className="uppercase font-regular text-[16px] max-mobile:text-sm leading-[150%]">
                  Empowerment & Conscious Elegance
                </div>
                <div className="text-sm leading-[150%] max-mobile:text-xs ">
                  Rooted in a philosophy of conscious elegance, MEMOÍ seeks to
                  empower women through designs that honor both beauty and purpose
                  - pieces made to be cherished, worn, and remembered. They are
                  not mere garments, but foundational investments crafted for a
                  lifetime of confidence.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default CommitmentsPage;
