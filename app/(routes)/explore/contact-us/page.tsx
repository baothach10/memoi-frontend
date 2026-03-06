"use client";

import Link from "next/link";
import Footer from "@/components/ui/organisms/Footer";
import FacebookIcon from "@/components/ui/atoms/FacebookIcon";
import InstagramIcon from "@/components/ui/atoms/InstagramIcon";

export default function ContactUsPage() {
    const mailTo = "mailto:hello@memoi.com";
    const whatsapp = "https://wa.me/6591234567?text=Hi%20MEMO%C3%8D%20team,%20I%20have%20a%20question";

    return (
        <div className="min-h-screen h-full w-full relative" data-header-theme="light">
            <section className="relative flex w-full min-h-screen justify-center px-25 flex-col max-tablet:px-0 smaller-tablet:max-tablet:max-w-[375px] max-tablet:mx-auto max-mobile:px-5">
                <div className="relative w-full h-full text-center">
                    <h1 className="text-2xl tracking-widest mb-12 font-regular py-3.5 max-mobile:text-lg max-mobile:mb-[18px]">CONTACT US</h1>

                    <div className="grid grid-cols-3 gap-10 max-tablet:grid-cols-1 text-center px-20 max-tablet:px-0 max-mobile:gap-8">
                        {/* Mail */}
                        <div className="flex flex-col items-center gap-8 max-mobile:gap-5">
                            <div className="flex flex-col gap-5 max-mobile:gap-3.5">
                                <h3 className="text-[16px] font-regular uppercase max-mobile:text-sm">MAIL US</h3>
                                <div className="leading-normal gap-1 flex flex-col">
                                    <p className="text-sm text-black tracking-[4%] max-mobile:text-xs" >Send your inquiries to <span className="underline">info@memoiofficial.com</span>. We will respond within 48 business hours.</p>
                                    <p className="text-black/60 text-xs">Service available from Monday to Sunday from 10am to 9pm (ICT).</p>
                                </div>
                            </div>
                            <Link href={mailTo} className="relative w-full" target="_blank" rel="noreferrer">
                                <span className="block w-full bg-transparent text-black border border-black/20  py-4 px-8 text-sm transition-colors duration-200 hover:bg-black hover:text-white max-mobile:py-3">
                                    Mail us
                                </span>
                            </Link>
                        </div>

                        {/* Call / Whatsapp */}
                        <div className="flex flex-col items-center gap-8 max-mobile:gap-5">
                            <div className="flex flex-col gap-5 max-mobile:gap-3.5">
                                <h3 className="text-[16px] font-regular uppercase max-mobile:text-sm">CALL US</h3>
                                <div className="leading-normal gap-1 flex flex-col">
                                    <p className="text-sm text-black tracking-[4%] max-mobile:text-xs">Our Client Advisors would be delighted to assist you. You may contact us at <span className="underline">(+65) 85939373</span></p>
                                    <p className="text-black/60 text-xs">Calls may be recorded for quality assurance.</p>
                                </div>
                            </div>
                            <Link href={whatsapp} target="_blank" rel="noreferrer" className="relative w-full">
                                <span className="block w-full bg-transparent text-black border border-black/20 py-4 px-8 text-sm transition-colors duration-200 hover:bg-black hover:text-white max-mobile:py-3">
                                    Whatsapp us
                                </span>
                            </Link>
                        </div>

                        {/* Social */}
                        <div className="flex flex-col items-center gap-8 max-mobile:gap-5">
                            <div className="flex flex-col gap-5 max-mobile:gap-3.5">
                                <h3 className="text-[16px] font-regular uppercase max-mobile:text-sm">SOCIAL MEDIA</h3>
                                <p className="text-sm text-black tracking-[4%] max-mobile:text-xs">For quick support, message us directly on Facebook (@memoi) or Instagram (@memoi.official). We aim to reply to DMs within 12 hours during service hours.</p>
                            </div>
                            <div className="flex w-full relative gap-4 items-center justify-center">
                                <Link href="#" className="p-4 border border-black/20 rounded-full inline-flex items-center justify-center max-mobile:p-3">
                                    <FacebookIcon width={20} height={20} />
                                </Link>
                                <Link href="#" className="p-4 border border-black/20 rounded-full inline-flex items-center justify-center max-mobile:p-3">
                                    <InstagramIcon width={20} height={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
