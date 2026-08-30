"use client";

import OrderItemCard from "./OrderItemCard";
import OrderProgress from "./OrderProgress";
import BillingPaymentInfo from "./BillingPaymentInfo";
import { useOrderDetailQuery } from "@/queries/useOrderDetailQuery";

export default function OrderDetailContent({ orderId }: { orderId: string }) {
  const { data: order, isLoading, isError } = useOrderDetailQuery(orderId);

  if (isLoading) {
    return (
      <div className="px-[100px] max-tablet:px-[5%] text-sm max-mobile:text-xs w-full min-h-dvh flex items-center justify-center pt-32">
        <p className="text-sm text-black">
          Loading...
        </p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="px-[100px] max-tablet:px-[5%] text-sm max-mobile:text-xs w-full min-h-dvh flex flex-col items-center justify-center pt-32 gap-6">
        <p className="text-sm text-black">
          Failed to load order details
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs underline underline-offset-4 cursor-pointer decoration-black/40"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="px-[100px] max-tablet:px-[5%] w-full flex flex-col gap-14 max-tablet:gap-14 pt-32 max-tablet:pt-26 pb-27 max-tablet:pb-24 max-mobile:pb-15 max-mobile:pt-24 max-mobile:gap-9">
      <div className="w-full flex flex-col gap-12 max-tablet:gap-8 max-mobile:gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 tablet:gap-8">
          <div className="flex gap-4 flex-row justify-between ">
            {/* Status and Action Row (Mobile) / Left Content (Desktop) */}
            <div className="flex justify-between flex-col items-start gap-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${order.status === 'COMPLETED' ? 'bg-[#079455]' : 'bg-[#BE123C]'}`}></span>
                <span className={`${order.status === 'COMPLETED' ? 'text-[#079455]' : 'text-[#BE123C]'} text-sm font-regular`}>
                  {order.status === 'COMPLETED' ? 'Completed' : 'In progress'}
                </span>
              </div>

              <h1 className="text-xl font-regular uppercase max-mobile:text-lg leading-none">ORDER ID #{order.order_number}</h1>
            </div>
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
            customer={order.customer}
            address={order.shipTo}
            subtotal={order.items.reduce((sum, i) => sum + (i.sale_price ? i.sale_price : i.price) * i.quantity, 0)}
            tierDiscount={order.tier_discount_amount}
            welcomeDiscount={order.welcome_discount_amount}
            promoDiscount={order.promo_discount_amount}
            birthMonthDiscount={order.birth_month_discount}
            shippingFee={order.shipping_fee}
            total={order.total}
            currency={order.currency}
          />
        </div>
      </div>
    </div>
  );
}
