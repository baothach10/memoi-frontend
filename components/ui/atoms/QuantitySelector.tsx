interface QuantitySelectorProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
}

export default function QuantitySelector({ quantity, onIncrease, onDecrease }: QuantitySelectorProps) {
    return (
        <div className="flex items-center bg-black/10">
            <button
                onClick={onDecrease}
                disabled={quantity <= 1}
                className={`w-8 h-8 flex items-center justify-center transition-colors text-sm ${quantity <= 1
                    ? "text-black/20 cursor-not-allowed"
                    : "text-black hover:text-black/70"
                    }`}
                aria-label="Decrease quantity"
            >
                −
            </button>
            <div className="py-0.5 bg-[#fffefa] relative h-full">
                <div className="relative w-12 h-6 flex items-center justify-center text-sm">
                    {quantity}
                </div>
            </div>
            <button
                onClick={onIncrease}
                className="w-8 h-8 flex items-center justify-center text-black hover:text-black transition-colors text-sm"
                aria-label="Increase quantity"
            >
                +
            </button>
        </div>
    );
}
