"use client";

import { BillingInfo, PaymentInfo } from "./types";

interface BillingPaymentInfoProps {
  billingInfo: BillingInfo;
  paymentInfo: PaymentInfo;
  currency: string;
}

export default function BillingPaymentInfo({ billingInfo, paymentInfo, currency }: BillingPaymentInfoProps) {
  return (
    <div className="flex flex-col gap-12 max-mobile:gap-9">
      {/* Billing Information */}
      <div className="flex flex-col gap-12 pb-12 border-b border-black/10 max-mobile:gap-6 max-mobile:pb-9">
        <h3 className="text-xl font-regular uppercase text-black">Billing Information</h3>
        <div className="flex flex-col gap-5 text-sm font-regular text-black">
          <div className="grid grid-cols-3 gap-4">
            <span>Full name</span>
            <span className="col-span-2 text-right">{billingInfo.fullName}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <span>Email</span>
            <span className="col-span-2 text-right">{billingInfo.email}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <span>Phone number</span>
            <span className="col-span-2 text-right">{billingInfo.phone}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <span>Address</span>
            <span className="col-span-2 text-right">{billingInfo.address}</span>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="flex flex-col gap-8 max-mobile:gap-6">
        <h3 className="text-xl font-regular uppercase text-black">Payment Information</h3>
        <div className="flex flex-col gap-5 text-sm font-regular">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{currency} {paymentInfo.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{paymentInfo.shipping}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>{currency} {paymentInfo.discount.toFixed(2)}</span>
          </div>
        </div>

        {/* Total Amount */}
        <div className="flex justify-between items-baseline pt-8 border-t border-black/10 font-regular text-xl max-mobile:text-lg max-mobile:pt-6">
          <div className="flex items-baseline gap-2">
            <span>Total</span>
            <span className=" text-black/40 uppercase">(TAX INCLUDED)</span>
          </div>
          <span>{currency} {paymentInfo.subtotal - paymentInfo.discount}</span>
        </div>
      </div>
    </div>
  );
}
