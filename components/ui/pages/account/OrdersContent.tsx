"use client";

import { useState } from "react";
import { Order } from "./types";
import OrderCard from "./OrderCard";

// Mock data based on the provided images
const MOCK_ORDERS: Order[] = [
  {
    id: "ABC123DE45",
    date: "22 March 2026",
    shipTo: "Ho Chi Minh City, Vietnam",
    status: "In progress",
    deliveryDetail: "Estimated arrival: 28 May 2026",
    total: 1680,
    currency: "SGD",
    items: [
      {
        id: "item-1",
        name: "Sparrow V-cut Silk Top",
        color: "WHITE",
        size: "L",
        price: 420,
        quantity: 1,
        image: "https://d380qwdachaae3.cloudfront.net/molting-mesh-evening-gown-1.png",
      },
      {
        id: "item-2",
        name: "Hand-embroidered Rose Skirt",
        color: "PINK", 
        price: 420,
        quantity: 1,
        image: "https://d380qwdachaae3.cloudfront.net/molting-mesh-evening-gown-1.png",
      },
      {
        id: "item-3",
        name: "Silk Evening Gown",
        color: "BLACK",
        size: "M",
        price: 840,
        quantity: 1,
        image: "https://d380qwdachaae3.cloudfront.net/molting-mesh-evening-gown-1.png",
      },
    ],
  },
  {
    id: "ABC123DE45", // Repeated ID in image? Let's use unique ones
    date: "18 March 2026",
    shipTo: "Hanoi, Vietnam",
    status: "In progress",
    deliveryDetail: "Estimated arrival: 28 March 2026",
    total: 1260,
    currency: "SGD",
    items: [
      {
        id: "item-4",
        name: "Arsenic Bubble Mini Dress",
        color: "WHITE",
        size: "L",
        price: 420,
        quantity: 1,
        image: "https://d380qwdachaae3.cloudfront.net/molting-mesh-evening-gown-1.png",
      },
      {
        id: "item-5",
        name: "Lady Bird Mini Dress",
        color: "BURGUNDY",
        size: "L",
        price: 420,
        quantity: 1,
        image: "https://d380qwdachaae3.cloudfront.net/molting-mesh-evening-gown-1.png",
      },
      {
        id: "item-6",
        name: "Floral Summer Dress",
        color: "BLUE",
        size: "M",
        price: 420,
        quantity: 1,
        image: "https://d380qwdachaae3.cloudfront.net/molting-mesh-evening-gown-1.png",
      },
    ],
  },
  {
    id: "AB123CDE45",
    date: "17 January 2026",
    shipTo: "Ho Chi Minh City, Vietnam",
    status: "Completed",
    deliveryDetail: "Delivered: 20 May 2026",
    total: 840,
    currency: "SGD",
    items: [
      {
        id: "item-7",
        name: "Paradise Denim Corset",
        color: "DENIM",
        size: "L",
        price: 420,
        quantity: 2,
        image: "https://d380qwdachaae3.cloudfront.net/molting-mesh-evening-gown-1.png",
      },
    ],
  },
];

type OrderStatus = "All" | "In progress" | "Completed";

export default function OrdersContent() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("All");

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    if (activeTab === "All") return true;
    return order.status === activeTab;
  });

  const tabs: OrderStatus[] = ["All", "In progress", "Completed"];

  const getCount = (status: OrderStatus) => {
    if (status === "All") return MOCK_ORDERS.length;
    return MOCK_ORDERS.filter((o) => o.status === status).length;
  };

  return (
    <div className="flex flex-col gap-12 max-mobile:gap-9">
      {/* Tabs */}
      <div className="flex gap-2.5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-[200px] py-5 px-10 border transition-all text-sm group max-tablet:w-full max-tablet:px-0 max-mobile:py-4 max-mobile:text-xs ${
              activeTab === tab
              ? "bg-black text-white border-black"
              : "bg-transparent text-black border-black/10 hover:bg-black hover:text-white"
              }`}
          >
            {tab} <span className={`transition-colors ${
              activeTab === tab ? "text-white/40" : "text-black/60 group-hover:text-white/40"
            }`}>({getCount(tab)})</span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-8 max-mobile:gap-9">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, idx) => (
            <OrderCard key={`${order.id}-${idx}`} order={order} />
          ))
        ) : (
          <div className="min-h-[400px] flex items-center justify-center border border-black/10">
            <p className="text-sm text-black/40 uppercase tracking-widest font-light">
              No orders found in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
