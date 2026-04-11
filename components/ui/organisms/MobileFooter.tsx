"use client"

import MemoiGraphicLogo from "../atoms/MemoiGraphicLogo";
import FacebookIcon from "../atoms/FacebookIcon";
import InstagramIcon from "../atoms/InstagramIcon";
import TiktokIcon from "../atoms/TiktokIcon";
import ExpandableSection from "../molecules/ExpandableSection";
import useIsMobile from "@/hooks/useIsMobile";
import Link from "next/link";

export function MobileFooter() {
    const isMobile = useIsMobile(768);
    const logoWidth = isMobile ? 54 : 62;
    const logoHeight = isMobile ? 35 : 40;
    return (
        <footer className="bg-[#fffefa] text-black">
            <div className="flex flex-col mx-auto gap-10 pt-10">
                <div className="flex flex-col text-center justify-center items-center gap-8">
                    <MemoiGraphicLogo width={logoWidth} height={logoHeight} />
                    <div className="w-[600px] text-[18px] leading-normal tracking-[0.07rem] max-mobile:text-xs max-mobile:w-full max-mobile:px-4">
                        MEMOÍ exists for the woman becoming herself. We believe true luxury lies in conscious living and timeless quality. Our pieces are an act of service: accessible elegance designed to honor your choices and support your growth.
                    </div>
                </div>
                <div className="grid grid-cols-1 w-full mx-auto text-center">
                    <ExpandableSection defaultOpen={false} className="relative w-full px-10 py-6 border-b border-b-black/10 max-mobile:px-4 max-mobile:py-4" title={<h4 className="font-regular mb-2 text-[16px] uppercase max-mobile:text-[14px]">Shop</h4>}>
                        <ul className="space-y-2 text-black/60 text-sm flex flex-col items-start max-mobile:text-xs">
                            <li>
                                <Link href="#" className="hover:text-black transition cursor-pointer">
                                    Dresses
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-black transition cursor-pointer">
                                    Tops
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-black transition cursor-pointer">
                                    Shorts
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-black transition cursor-pointer">
                                    Pants
                                </Link>
                            </li>
                        </ul>
                    </ExpandableSection>

                    <ExpandableSection defaultOpen={false} className="relative w-full px-10 py-6 border-b border-b-black/10 max-mobile:px-4 max-mobile:py-4" title={<h4 className="font-regular mb-2 text-[16px] uppercase max-mobile:text-[14px]">Explore</h4>}>
                        <ul className="space-y-2 text-black/60 text-sm flex flex-col items-start max-mobile:text-xs">
                            <li>
                                <Link href="#" className="hover:text-black transition cursor-pointer">
                                    About us
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-black transition cursor-pointer">
                                    The MEMOÍ House
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-black transition cursor-pointer">
                                    Our Commitments
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-black transition cursor-pointer">
                                    Contact us
                                </Link>
                            </li>
                        </ul>
                    </ExpandableSection>

                    <ExpandableSection defaultOpen={false} className="relative w-full px-10 py-6 border-b border-b-black/10 max-mobile:px-4 max-mobile:py-4" title={<h4 className="font-regular mb-2 text-[16px] uppercase max-mobile:text-[14px]">Help</h4>}>
                        <ul className="space-y-2 text-black/60 text-sm flex flex-col items-start max-mobile:text-xs">
                            <li>
                                <Link href="#" className="hover:text-black transition cursor-pointer">
                                    Shipping & Exchanges
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-black transition cursor-pointer">
                                    Orders & Payment
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-black transition cursor-pointer">
                                    MEMOÍ care
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-black transition cursor-pointer">
                                    Exchange Request
                                </Link>
                            </li>
                        </ul>
                    </ExpandableSection>

                    <ExpandableSection defaultOpen={false} className="relative w-full px-10 py-6 max-mobile:px-4 max-mobile:py-4" title={<h4 className="font-regular mb-2 text-[16px] uppercase max-mobile:text-[14px]">Legal</h4>}>
                        <ul className="space-y-2 text-black/60 text-sm flex flex-col items-start max-mobile:text-xs">
                            <li>
                                <Link href="/privacy-policy" className="hover:text-black transition cursor-pointer">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms-and-conditions" className="hover:text-black transition cursor-pointer">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-black transition cursor-pointer">
                                    Cookies Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-black transition cursor-pointer">
                                    Cookies Settings
                                </Link>
                            </li>
                        </ul>
                    </ExpandableSection>
                </div>
                <div className="border-t border-black/10 pt-5 text-black text-sm pb-8">
                    <div className="flex justify-between px-10 max-mobile:flex-col max-mobile:gap-4 max-mobile:px-4 max-mobile:items-center max-mobile:text-center">
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

export default MobileFooter;
