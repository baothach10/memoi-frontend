import MemoiGraphicLogo from "../atoms/MemoiGraphicLogo";
import FacebookIcon from "../atoms/FacebookIcon";
import InstagramIcon from "../atoms/InstagramIcon";
import TiktokIcon from "../atoms/TiktokIcon";
import ExpandableSection from "../molecules/ExpandableSection";

export function Footer() {
  return (
    <footer className="bg-[#fffefa] text-black">
      <div className="flex flex-col mx-auto gap-20 pt-20 max-tablet:gap-10 max-tablet:pt-10">
        <div className="flex flex-col text-center justify-center items-center gap-8">
          <div className="max-tablet:hidden">
            <MemoiGraphicLogo width={62} height={40} />
          </div>
          <div className="laptop:hidden">
            <MemoiGraphicLogo width={54} height={35} />
          </div>
          <div className="w-[600px] text-[18px] leading-normal tracking-[0.07rem] max-mobile:text-xs max-mobile:w-full max-mobile:px-4">
            MEMOÍ exists for the woman becoming herself. We believe true luxury lies in conscious living and timeless quality. Our pieces are an act of service: accessible elegance designed to honor your choices and support your growth.
          </div>
        </div>
        <div className="grid max-tablet:grid-cols-1 grid-cols-4 gap-16 w-2/3 mx-auto text-center max-tablet:hidden">
          <div className="gap-8 flex flex-col items-center justify-center">
            <h4 className="font-regular mb-2 text-[16px] uppercase">Shop</h4>
            <ul className="space-y-2 text-black/60 text-sm">
              <li>
                <a href="#" className="hover:text-black transition">
                  Dresses
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Tops
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Skirts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Pants
                </a>
              </li>
            </ul>
          </div>
          <div className="gap-8 flex flex-col items-center justify-center">
            <h4 className="font-regular mb-2 text-[16px] uppercase">
              Explore
            </h4>
            <ul className="space-y-2 text-black/60 text-sm">
              <li>
                <a href="#" className="hover:text-black transition">
                  About us
                </a>
              </li>
              <li>
                <a href="/help?tab=house" className="hover:text-black transition">
                  The MEMOÍ House
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Our Commitments
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Contact us
                </a>
              </li>
            </ul>
          </div>
          <div className="gap-8 flex flex-col items-center justify-center">
            <h4 className="font-regular mb-2 text-[16px] uppercase">Help</h4>
            <ul className="space-y-2 text-black/60 text-sm">
              <li>
                <a href="/help?tab=shipping" className="hover:text-black transition">
                  Shipping & Exchanges
                </a>
              </li>
              <li>
                <a href="/help?tab=orders" className="hover:text-black transition">
                  Orders & Payment
                </a>
              </li>
              <li>
                <a href="/help?tab=care" className="hover:text-black transition">
                  MEMOÍ care
                </a>
              </li>
              <li>
                <a href="/help?tab=shipping" className="hover:text-black transition">
                  Exchange Request
                </a>
              </li>
            </ul>
          </div>
          <div className="gap-8 flex flex-col items-center justify-center">
            <h4 className="font-regular mb-2 text-[16px] uppercase">Legal</h4>
            <ul className="space-y-2 text-black/60 text-sm">
              <li>
                <a href="#" className="hover:text-black transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Cookies Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Cookies Settings
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 w-full mx-auto text-center laptop:hidden">
          <ExpandableSection defaultOpen={false} className="relative mx-10 py-6 border-b border-b-black/10 max-mobile:px-4 max-mobile:py-4 max-mobile:mx-5" title={<h4 className="font-regular text-[16px] uppercase max-mobile:text-[14px]">Shop</h4>}>
            <ul className="space-y-2 text-black/60 text-sm flex flex-col items-start max-mobile:text-xs">
              <li>
                <a href="#" className="hover:text-black transition">
                  Dresses
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Tops
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Skirts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Pants
                </a>
              </li>
            </ul>
          </ExpandableSection>

          {/* <div className="laptop:max-desktop:w-px max-tablet:h-px border-b-black/10 self-stretch max-mobile:mx-5" /> */}

          <ExpandableSection defaultOpen={false} className="relative  mx-10  py-6 border-b border-b-black/10 max-mobile:px-4 max-mobile:py-4 max-mobile:mx-5" title={<h4 className="font-regular text-[16px] uppercase max-mobile:text-[14px]">Explore</h4>}>
            <ul className="space-y-2 text-black/60 text-sm flex flex-col items-start max-mobile:text-xs">
              <li>
                <a href="#" className="hover:text-black transition">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  The MEMOÍ House
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Our Commitments
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Contact us
                </a>
              </li>
            </ul>
          </ExpandableSection>

          <ExpandableSection defaultOpen={false} className="relative mx-10 py-6 border-b border-b-black/10 max-mobile:px-4 max-mobile:py-4 max-mobile:mx-5" title={<h4 className="font-regular text-[16px] uppercase max-mobile:text-[14px]">Help</h4>}>
            <ul className="space-y-2 text-black/60 text-sm flex flex-col items-start max-mobile:text-xs">
              <li>
                <a href="#" className="hover:text-black transition">
                  Shipping & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Orders & Payment
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  MEMOÍ care
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Exchange Request
                </a>
              </li>
            </ul>
          </ExpandableSection>

          <ExpandableSection defaultOpen={false} className="relative mx-10 py-6 max-mobile:px-4 max-mobile:py-4 max-mobile:mx-5" title={<h4 className="font-regular text-[16px] uppercase max-mobile:text-[14px]">Legal</h4>}>
            <ul className="space-y-2 text-black/60 text-sm flex flex-col items-start max-mobile:text-xs">
              <li>
                <a href="#" className="hover:text-black transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Cookies Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Cookies Settings
                </a>
              </li>
            </ul>
          </ExpandableSection>
        </div>
        <div className="border-t border-black/10 pt-3 text-black text-sm pb-5 max-tablet:pb-8 max-tablet:pt-5">
          <div className="flex justify-between px-25 smaller-tablet:max-tablet:px-10 max-mobile:flex-col max-mobile:gap-4 max-mobile:px-4 max-mobile:items-center max-mobile:text-center max-mobile:text-xs max-mobile:leading-normal">
            <p>&copy; 2025 MEMOI ™. A brand by NPS Apparel & Trading (UEN 53508613W). All rights reserved.</p>
            <div className="flex gap-5 max-mobile:gap-[18px]">
              <FacebookIcon
                width={16}
                height={16}
              />
              <InstagramIcon
                width={16}
                height={16}
              />
              <TiktokIcon
                width={16}
                height={16}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
