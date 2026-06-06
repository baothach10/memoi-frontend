import Image from "next/image";
import QuantitySelector from "@/components/ui/atoms/QuantitySelector";
import { CartItem } from "@/utils/cartUtils";
import { AlertCircle } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

interface CartItemCardProps {
    item: CartItem;
    onRemove: () => void;
    onIncrease: () => void;
    onDecrease: () => void;
}

export default function CartItemCard({ item, onRemove, onIncrease, onDecrease }: CartItemCardProps) {
    const { currency } = useCurrency();
    return (
        <div className="bg-linear-to-r from-[#fffefa] via-black/2 to-[#fffefa]">
            <div className="flex gap-8 max-mobile:gap-4">
                {/* Product Image */}
                <div className="relative w-[25%] aspect-5/6 shrink-0 flex items-center justify-center overflow-hidden">
                    <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        sizes="(min-width: 1024px) 50vw, (min-width: 768px) and (max-width: 1023px) 50vw, (max-width: 767px) 50vw"
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-between flex-1 min-w-0 py-[2.5%]">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-4">
                            <h3 className="text-sm leading-snug font-regular max-mobile:text-xs">
                                {item.productName}
                            </h3>
                            {(item.stock === 0 || item.quantity > item.stock) && (
                                <div className="flex items-start gap-1 text-[#B3261E] text-xs">
                                    <AlertCircle size={12} className="mt-px max-tablet:mt-px" />
                                    {item.stock === 0 ? "Out of stock" : `${item.stock} lefts in stock`}
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-black/60 max-mobile:text-xs ">
                            {item.color_name.toUpperCase()}, {item.size}
                        </p>
                    </div>

                    <div className="flex items-center justify-between max-mobile:hidden">
                        <p className="text-base font-regular max-mobile:text-xs ">
                            {currency} {item.price}
                        </p>

                        <div className="flex items-center gap-3">
                            <QuantitySelector
                                quantity={item.quantity}
                                onIncrease={onIncrease}
                                onDecrease={onDecrease}
                                isIncreaseDisabled={item.quantity > item.stock}
                            />

                            {/* Remove Button */}
                            <button
                                onClick={onRemove}
                                className="text-xs text-black/60 hover:text-black cursor-pointer transition-colors uppercase underline underline-offset-2 decoration-black/40 max-mobile:text-[10px]"
                            >
                                Remove
                            </button>
                        </div>
                    </div>


                    <div className="hidden max-mobile:flex max-mobile:flex-col max-mobile:justify-between max-mobile:gap-2 max-mobile:pt-4">
                        <p className="text-base font-regular max-mobile:text-xs ">
                            {currency} {item.price}
                        </p>

                        <div className="flex items-center gap-3 justify-between">
                            <QuantitySelector
                                quantity={item.quantity}
                                onIncrease={onIncrease}
                                onDecrease={onDecrease}
                                isIncreaseDisabled={item.quantity > item.stock}
                            />

                            {/* Remove Button */}
                            <button
                                onClick={onRemove}
                                className="text-xs text-black/60 hover:text-black cursor-pointer transition-colors uppercase underline underline-offset-2 decoration-black/40 max-mobile:text-[10px]"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
