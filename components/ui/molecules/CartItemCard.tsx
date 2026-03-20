import Image from "next/image";
import QuantitySelector from "@/components/ui/atoms/QuantitySelector";
import { CartItem } from "@/utils/cartUtils";

interface CartItemCardProps {
    item: CartItem;
    onRemove: () => void;
    onIncrease: () => void;
    onDecrease: () => void;
}

export default function CartItemCard({ item, onRemove, onIncrease, onDecrease }: CartItemCardProps) {
    return (
        <div className="bg-linear-to-r from-[#fffefa] via-black/2 to-[#fffefa]">
            <div className="flex gap-8">
                {/* Product Image */}
                <div className="w-[25%] aspect-5/6 shrink-0 flex items-center justify-center overflow-hidden">
                    <Image
                        src={item.productImage}
                        alt={item.productName}
                        width={100}
                        height={140}
                        className="object-cover w-full h-full"
                        unoptimized
                    />
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-between flex-1 min-w-0 py-[2.5%]">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm leading-snug font-regular max-mobile:text-xs ">
                            {item.productName}
                        </h3>
                        <p className="text-sm text-black/60 tracking-wide max-mobile:text-xs ">
                            {item.color_name.toUpperCase()}, {item.size}
                        </p>
                    </div>

                    <div className="flex items-center justify-between max-mobile:hidden">
                        <p className="text-base font-regular max-mobile:text-xs ">
                            SGD {item.price}
                        </p>

                        <div className="flex items-center gap-3">
                            <QuantitySelector
                                quantity={item.quantity}
                                onIncrease={onIncrease}
                                onDecrease={onDecrease}
                            />

                            {/* Remove Button */}
                            <button
                                onClick={onRemove}
                                className="text-xs text-black/60 hover:text-black tracking-wide transition-colors uppercase underline underline-offset-2 decoration-black/40 max-mobile:text-[10px]"
                            >
                                Remove
                            </button>
                        </div>
                    </div>


                    <div className="hidden max-mobile:flex max-mobile:flex-col max-mobile:justify-between max-mobile:gap-2 max-mobile:pt-4">
                        <p className="text-base font-regular max-mobile:text-xs ">
                            SGD {item.price}
                        </p>

                        <div className="flex items-center gap-3 justify-between">
                            <QuantitySelector
                                quantity={item.quantity}
                                onIncrease={onIncrease}
                                onDecrease={onDecrease}
                            />

                            {/* Remove Button */}
                            <button
                                onClick={onRemove}
                                className="text-xs text-black/60 hover:text-black tracking-wide transition-colors uppercase underline underline-offset-2 decoration-black/40 max-mobile:text-[10px]"
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
