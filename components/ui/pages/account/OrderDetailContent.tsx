"use client";

import OrderItemCard from "./OrderItemCard";
import OrderProgress from "./OrderProgress";
import BillingPaymentInfo from "./BillingPaymentInfo";
import { OrderDetails } from "./types";

const MOCK_ORDER_DETAILS: OrderDetails = {
  id: "ABC123DE45",
  date: "23 March 2026",
  shipTo: "Ho Chi Minh City, Vietnam",
  status: "In progress",
  deliveryDetail: "Estimated arrival: 28 May 2026",
  total: 1680,
  currency: "SGD",
  progress: [
    { label: "ORDER PLACED", date: "23 March 2026", completed: true },
    { label: "ORDER PACKED", date: "24 March 2026", completed: true, active: true },
    { label: "IN TRANSIT", date: "25 March 2026", completed: false },
    { label: "DELIVERED", date: "28 March 2026", completed: false }
  ],
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
      name: "Paradise White Corset",
      color: "WHITE",
      size: "L",
      price: 420,
      quantity: 1,
      image: "https://d380qwdachaae3.cloudfront.net/molting-mesh-evening-gown-1.png",
    },
    {
      id: "item-4",
      name: "Paradise Stripe Corset",
      color: "BLACK",
      size: "L",
      price: 420,
      quantity: 1,
      image: "https://d380qwdachaae3.cloudfront.net/molting-mesh-evening-gown-1.png",
    }
  ],
  billingInfo: {
    fullName: "Duong Vu Thanh Ngoc",
    email: "thanhngoc17@gmail.com",
    phone: "+84 909003667",
    address: "A57 Nam Thong 3, W. Tan Phu, D. 7, Ho Chi Minh City, Vietnam"
  },
  paymentInfo: {
    subtotal: 1680,
    shipping: "Free",
    discount: 0
  }
};

export default function OrderDetailContent({ orderId }: { orderId: string }) {
  // In a real app, we would fetch the order by ID here
  const order = MOCK_ORDER_DETAILS;

  return (
    <div className="w-full flex flex-col gap-14 max-tablet:gap-14 pt-32 max-tablet:pt-26 pb-27 max-tablet:pb-24 max-mobile:pb-15 max-mobile:pt-16 max-mobile:gap-9">
      <div className="w-full flex flex-col gap-12 max-tablet:gap-8 max-mobile:gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 tablet:gap-8">
          <div className="flex gap-4 flex-row justify-between">
            {/* Status and Action Row (Mobile) / Left Content (Desktop) */}
            <div className="flex justify-between flex-col items-start tablet:gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#BE123C]"></span>
                <span className="text-[#BE123C] text-sm font-regular">{order.status}</span>
              </div>
          
              <h1 className="text-2xl font-regular uppercase max-mobile:text-lg">ORDER ID #{order.id}</h1>
            </div>

            {/* View Tracking Button (Desktop) */}
            <button className="px-14 py-4 border border-black/10 text-sm transition-all hover:bg-black hover:text-white max-mobile:px-6 max-mobile:py-4 max-mobile:text-xs">
              View tracking
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <OrderProgress steps={order.progress} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 laptop:gap-16">
        {/* Left Column - Order Summary */}
        <div className="col-span-12 laptop:col-span-8 flex flex-col gap-12 max-mobile:gap-6">
          <h2 className="text-xl font-regular uppercase text-black max-mobile:text-[16px]">Order Summary</h2>
          <div className="flex flex-col gap-4 max-mobile:gap-2.5">
            {order.items.map((item) => (
              <OrderItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Right Column - Info */}
        <div className="col-span-12 laptop:col-span-4 flex flex-col gap-12 max-tablet:pt-14 max-mobile:pt-9">
          <BillingPaymentInfo
            billingInfo={order.billingInfo}
            paymentInfo={order.paymentInfo}
            currency={order.currency}
          />
        </div>
      </div>
    </div>
  );
}
