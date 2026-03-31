"use client";

import { useState } from "react";
import Link from "next/link";
import OrderItemCard from "./OrderItemCard";

import { Order } from "./types";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const [showAllItems, setShowAllItems] = useState(false);

  // Show only 2 items initially if there are more than 2
  const visibleItems = showAllItems ? order.items : order.items.slice(0, 2);
  const hasMoreItems = order.items.length > 2 && !showAllItems;

  return (
    <div className="border border-black/10 pt-10 flex flex-col gap-8 bg-transparent max-mobile:pt-6 max-mobile:gap-6">
      {/* Header */}
      <div className="flex gap-8 text-xs text-black/40 px-8 max-tablet:gap-0 justify-between max-mobile:px-4">
        <div className="flex flex-col gap-3 justify-between">
          <p className="font-regular uppercase max-mobile:text-[10px]">Order ID</p>
          <p className="text-black text-2xl font-regular max-mobile:text-lg">{order.order_number}</p>
        </div>
        <div className="flex flex-col gap-3 justify-between max-mobile:hidden">
          <p className="font-regular uppercase">Order Placed</p>
          <p className="text-black text-sm">{order.date}</p>
        </div>
        <div className="flex flex-col gap-3 justify-between max-mobile:hidden">
          <p className="font-regular uppercase">Ship To</p>
          <p className="text-black text-sm">{order.shipTo}</p>
        </div>
        <div className="flex flex-col gap-3 text-right font-regular justify-between max-mobile:text-xs">
          <div className="flex items-center justify-end gap-2">
            <span className={`w-2 h-2 rounded-full ${order.status === 'COMPLETED' ? 'bg-[#079455]' : 'bg-[#BE123C]'}`}></span>
            <p className={`${order.status === 'COMPLETED' ? 'text-[#079455]' : 'text-[#BE123C]'} font-medium`}>
              {order.status === 'COMPLETED' ? 'Completed' : 'In progress'}
            </p>
          </div>
          <p className="text-black text-sm">{order.deliveryDetail}</p>
        </div>
      </div>

      {/* Items */}
      <div className="flex flex-col bg-transparent gap-2.5 px-8 max-mobile:px-4">
        {visibleItems.map((item, index) => (
          <OrderItemCard 
            key={item.id} 
            item={item} 
            isLast={index === visibleItems.length - 1 && !hasMoreItems} 
          />
        ))}

        {hasMoreItems ? (
          <div className="flex justify-center">
            <button
              onClick={() => setShowAllItems(true)}
              className="text-sm text-black hover:text-black transition-colors underline underline-offset-4 decoration-black/40 max-mobile:text-xs"
            >
              View more
            </button>
          </div>
        ) : showAllItems && order.items.length > 2 && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowAllItems(false)}
              className="text-sm text-black hover:text-black transition-colors underline underline-offset-4 decoration-black/40 max-mobile:text-xs"
            >
              View less
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-black/10 py-5 px-8 max-mobile:px-4 max-mobile:py-3">
        <div className="flex items-baseline gap-2 text-xl max-mobile:text-[16px] ">
          <span className=" font-regular">Total: {order.currency} {order.total}</span>
          <span className=" text-black/60">({order.items.length} items)</span>
        </div>
        <Link 
          href={`/account/orders/${order.id}`}
          className="w-[200px] py-4 border border-black/10 text-sm hover:bg-black hover:text-white transition-all max-mobile:w-[120px] max-mobile:text-xs text-center"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
