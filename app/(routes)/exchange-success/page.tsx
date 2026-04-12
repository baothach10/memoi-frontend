"use client";

import Link from "next/link";
import Footer from "@/components/ui/organisms/Footer";

export default function ExchangeSuccessPage() {
    return (
        <div data-header-theme="light">
            <section className="flex w-full justify-center py-50 max-mobile:py-38 smaller-tablet:max-tablet:py-73">
                <div className="w-full max-w-[620px] flex flex-col gap-12 text-center max-mobile:px-5 max-mobile:gap-9">

                    {/* Title and Description */}
                    <div className="flex flex-col gap-8">
                        <h1 className="text-2xl font-regular uppercase max-mobile:text-lg">
                            Request Received!
                        </h1>
                        <div className="text-sm text-black/80 max-mobile:text-xs leading-relaxed space-y-2">
                            <p className="font-regular">
                                Thank you for submitting your exchange request!
                            </p>
                            <div className="space-y-1">
                                <p>
                                    Our team will contact you within 48 business hours via email to guide you through the next steps!
                                </p>
                                <p>
                                    If you have any questions regarding your order or our process, you can find information in our <Link href="/help" className="underline underline-offset-4 decoration-black/40">FAQ</Link> or visit <Link href="/explore/contact-us" className="underline underline-offset-4 decoration-black/40">Contact Us</Link> for direct assistance.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Button */}
                    <Link href="/">
                        <button className="w-full bg-black leading-none text-white py-4 cursor-pointer text-sm max-mobile:py-3.5 max-mobile:text-xs">
                            Return to Home
                        </button>
                    </Link>
                </div>
            </section>
            <Footer />
        </div>
    );
}
