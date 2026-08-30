"use client";

import Image from "next/image";

import { OrderItem } from "./types";
import { useCurrency } from "@/context/CurrencyContext";

interface OrderItemCardProps {
  item: OrderItem;
  isLast?: boolean;
}

export default function OrderItemCard({ item }: OrderItemCardProps) {
  const { currency } = useCurrency();
  const hasSalePrice = typeof item.sale_price === "number" && item.sale_price > 0 && item.sale_price !== item.price;

  return (
    <div className={` bg-linear-to-r from-[#fffefa] via-black/2 to-[#fffefa]`}>
      <div className="flex gap-8 max-mobile:gap-4">
        {/* Product Image */}
        <div className="relative w-[20%] aspect-5/6 shrink-0 flex items-center justify-center overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover w-full h-full"

          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between flex-1 min-w-0 py-[2.5%]">
          <div className="flex flex-col gap-2 max-mobile:gap-2">
            <h3 className="text-[16px] font-regular max-mobile:text-xs">
              {item.name}
            </h3>
            <p className="text-sm text-black/60 max-mobile:text-xs">
              <span className="uppercase">{item.color_name}</span>{item.size ? `, ${item.size}` : ''}
            </p>
          </div>



          <div className="flex items-center justify-between font-regular max-mobile:mt-10">
            <div className="flex items-center justify-center text-center gap-2.5 max-mobile:gap-3 max-tablet:gap-4">
              <p className={`text-base font-regular ${hasSalePrice ? 'line-through text-black/40' : ''} max-mobile:text-xs `}>
                {currency} {item.price.toFixed(2)}
              </p>
              {hasSalePrice && (
                <p className="text-base font-regular max-mobile:text-xs ">
                  {currency} {item.sale_price!.toFixed(2)}
                </p>
              )}
            </div>
            <p className="text-sm text-black/60 uppercase pr-8 max-mobile:text-xs max-mobile:pr-2.5">
              Quantity: {item.quantity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
