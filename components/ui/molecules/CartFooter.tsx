import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface CartFooterProps {
    subtotal: number;
    onClose: () => void;
    showStockError?: boolean;
}

export default function CartFooter({ subtotal, onClose, showStockError }: CartFooterProps) {
    return (
        <div className="border-t border-black/10 relative h-fit">
            {/* Subtotal */}
            <div className="px-[5%] pt-[3%] pb-[5%] max-mobile:pt-[4%] max-mobile:pb-[4%]">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xl uppercase font-regular max-mobile:text-[16px]">
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
            <div className="px-[5%] pb-[3%] flex gap-3 max-mobile:pb-[4%]">
                <Link
                    href="/cart"
                    onClick={onClose}
                    className="block text-center flex-1 py-[2%] border cursor-pointer border-black/20 text-black text-sm hover:bg-black hover:text-white transition-all duration-200 max-mobile:py-3 max-mobile:text-xs"
                >
                    View cart
                </Link>
                <Link
                    href="/checkout"
                    onClick={(e) => {
                        if (showStockError) {
                            e.preventDefault();
                            return;
                        }
                        onClose();
                    }}
                    className={`block text-center flex-1 py-[2%] cursor-pointer bg-black text-white text-sm hover:opacity-90 transition-all duration-200 max-mobile:py-3 max-mobile:text-xs ${showStockError ? "cursor-not-allowed opacity-50" : ""}`}
                >
                    Checkout
                </Link>
            </div>

            {/* Stock Error Message */}
            {showStockError && (
                <div className="px-[5%] pb-[3%] flex items-start gap-1 text-[#B3261E] text-xs max-mobile:pb-5">
                    <AlertCircle size={12} className="mt-px max-tablet:mt-px" />

                    Remove or adjust quantities for unavailable or excess items before checkout.

                </div>
            )}

            {/* Footer Links */}
            <div className="px-[5%] pb-[5%] flex items-center justify-between text-sm text-black/60 decoration-black/60 h-[25%] max-mobile:flex-col max-mobile:gap-2 max-mobile:text-xs max-mobile:items-start max-mobile:pb-[8%]">
                <p>
                    Need help?{" "}
                    <Link
                        href="/explore/contact-us"
                        className="underline underline-offset-4 decoration-black/40 hover:text-black transition-colors cursor-pointer"
                    >
                        Contact us
                    </Link>
                </p>
                <p>
                    By proceeding, you agree to our{" "}
                    <Link
                        href="/terms"
                        className="underline underline-offset-4 decoration-black/40 hover:text-black transition-colors cursor-pointer"
                    >
                        Terms & Conditions
                    </Link>
                </p>
            </div>
        </div>
    );
}
