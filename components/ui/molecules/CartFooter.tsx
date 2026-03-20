import Link from "next/link";

interface CartFooterProps {
    subtotal: number;
    onClose: () => void;
}

export default function CartFooter({ subtotal, onClose }: CartFooterProps) {
    return (
        <div className="border-t border-black/10">
            {/* Subtotal */}
            <div className="px-[5%] pt-[2%] pb-[2%] max-mobile:pt-[4%] max-mobile:pb-[4%]">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xl tracking-wider uppercase font-regular max-mobile:text-[16px]">
                            Subtotal
                        </p>
                        <p className="text-sm text-black/60 mt-4 tracking-wide max-mobile:text-xs max-mobile:mt-2">
                            TAX INCLUDED
                        </p>
                    </div>
                    <p className="text-xl font-regular max-mobile:text-lg">SGD {subtotal}</p>
                </div>
            </div>

            {/* Buttons */}
            <div className="px-[5%] pb-[2%] flex gap-3 max-mobile:pb-[4%]">
                <Link 
                    href="/cart"
                    onClick={onClose}
                    className="block text-center flex-1 py-[2%] border border-black/20 text-black text-sm tracking-wider hover:bg-black hover:text-white transition-all duration-200 max-mobile:py-[4%] max-mobile:text-xs"
                >
                    View cart
                </Link>
                <Link href="/checkout" onClick={onClose} className="block text-center flex-[1.5] py-[2%] bg-black text-white text-sm tracking-wider hover:opacity-90 transition-all duration-200 max-mobile:py-[4%] max-mobile:text-xs">
                    Checkout
                </Link>
            </div>

            {/* Footer Links */}
            <div className="px-[5%] pb-[2%] flex items-center justify-between text-sm text-black/60 decoration-black/60 h-[25%] max-mobile:flex-col max-mobile:gap-2 max-mobile:text-xs max-mobile:items-start">
                <p>
                    Need help?{" "}
                    <Link
                        href="/explore/contact-us"
                        className="underline underline-offset-4 hover:text-black transition-colors"
                    >
                        Contact us
                    </Link>
                </p>
                <p>
                    By proceeding, you agree to our{" "}
                    <Link
                        href="/terms"
                        className="underline underline-offset-4 hover:text-black transition-colors"
                    >
                        Terms & Conditions
                    </Link>
                </p>
            </div>
        </div>
    );
}
