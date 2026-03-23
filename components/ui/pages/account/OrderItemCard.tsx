"use client";

import Image from "next/image";

interface OrderItem {
  id: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderItemCardProps {
  item: OrderItem;
  isLast?: boolean;
}

export default function OrderItemCard({ item }: OrderItemCardProps) {
  return (
    <div className={` bg-linear-to-r from-[#fffefa] via-black/2 to-[#fffefa]`}>
      <div className="flex gap-8">
        {/* Product Image */}
        <div className="w-[25%] aspect-5/6 shrink-0 flex items-center justify-center overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            width={100}
            height={140}
            className="object-cover w-full h-full"
            unoptimized
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between flex-1 min-w-0 py-[2.5%]">
          <div className="flex flex-col gap-2 font-regular">
            <h3 className="text-[16px]">
              {item.name}
            </h3>
            <p className="text-sm text-black/60 uppercase">
              {item.color}, {item.size}
            </p>
          </div>

          <div className="flex items-center justify-between font-regular">
            <p className="text-[16px] uppercase">
              SGD {item.price}
            </p>
            <p className="text-sm text-black/60 uppercase pr-8">
              Quantity: {item.quantity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
