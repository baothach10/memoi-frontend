"use client";

import { useState } from "react";
import OrderItemCard from "./OrderItemCard";

interface OrderItem {
  id: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  shipTo: string;
  status: string;
  deliveryDetail: string;
  items: OrderItem[];
  total: number;
  currency: string;
}

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const [showAllItems, setShowAllItems] = useState(false);

  // Show only 2 items initially if there are more than 2
  const visibleItems = showAllItems ? order.items : order.items.slice(0, 2);
  const hasMoreItems = order.items.length > 2 && !showAllItems;

  return (
    <div className="border border-black/10 pt-10 flex flex-col gap-8 bg-transparent">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 text-xs text-black/40 px-10">
        <div className="flex flex-col gap-3 justify-between">
          <p className="font-regular uppercase">Order ID</p>
          <p className="text-black text-2xl font-regular">{order.id}</p>
        </div>
        <div className="flex flex-col gap-3 justify-between">
          <p className="font-regular uppercase">Order Placed</p>
          <p className="text-black text-sm">{order.date}</p>
        </div>
        <div className="flex flex-col gap-3 justify-between">
          <p className="font-regular uppercase">Ship To</p>
          <p className="text-black text-sm">{order.shipTo}</p>
        </div>
        <div className="flex flex-col gap-3 text-right font-regular justify-between">
          <div className="flex items-center justify-end gap-2">
            <span className={`w-2 h-2 rounded-full ${order.status === 'Completed' ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <p className={`${order.status === 'Completed' ? 'text-green-500' : 'text-red-500'} font-medium`}>{order.status}</p>
          </div>
          <p className="text-black text-sm">{order.deliveryDetail}</p>
        </div>
      </div>

      {/* Items */}
      <div className="flex flex-col bg-transparent gap-2.5 px-10">
        {visibleItems.map((item, index) => (
          <OrderItemCard 
            key={item.id} 
            item={item} 
            isLast={index === visibleItems.length - 1 && !hasMoreItems} 
          />
        ))}

        {hasMoreItems ? (
          <div className="py-4 flex justify-center">
            <button
              onClick={() => setShowAllItems(true)}
              className="text-sm text-black hover:text-black transition-colors underline underline-offset-4 decoration-black/40"
            >
              View more
            </button>
          </div>
        ) : showAllItems && order.items.length > 2 && (
          <div className="py-4 flex justify-center">
            <button
              onClick={() => setShowAllItems(false)}
              className="text-sm text-black hover:text-black transition-colors underline underline-offset-4 decoration-black/40"
            >
              View less
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-black/10 py-5 px-10">
        <div className="flex items-baseline gap-2 text-xl">
          <span className=" font-regular">Total: {order.currency} {order.total}</span>
          <span className=" text-black/60">({order.items.length} items)</span>
        </div>
        <button className="px-12 py-4 border border-black/10 text-sm hover:bg-black hover:text-white transition-all">
          View details
        </button>
      </div>
    </div>
  );
}
