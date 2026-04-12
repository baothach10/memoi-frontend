"use client";

interface BillingPaymentInfoProps {
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  address: string;
  subtotal: number;
  birthMonthDiscount: number;
  tierDiscount: number;
  promoDiscount: number;
  shippingFee: number;
  total: number;
  currency: string;
}

import { useCurrency } from "@/context/CurrencyContext";
import { useEffect } from "react";

export default function BillingPaymentInfo({
  customer,
  address,
  subtotal,
  tierDiscount,
  birthMonthDiscount,
  promoDiscount,
  shippingFee,
  total,
  currency
}: BillingPaymentInfoProps) {
  const { updateCurrency, currency: globalCurrency } = useCurrency();

  useEffect(() => {
    if (currency && currency.toUpperCase() !== globalCurrency) {
      updateCurrency(currency);
    }
  }, [currency, updateCurrency]);

  return (
    <div className="flex flex-col gap-12 max-mobile:gap-9">
      {/* Billing Information */}
      <div className="flex flex-col gap-12 pb-12 border-b border-black/10 max-mobile:gap-6 max-mobile:pb-9">
        <h3 className="text-xl font-regular uppercase text-black">Billing Information</h3>
        <div className="flex flex-col gap-5 text-sm font-regular text-black">
          <div className="grid grid-cols-3 gap-4">
            <span>First Name</span>
            <span className="col-span-2 text-right">{customer.first_name}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <span>Last Name</span>
            <span className="col-span-2 text-right">{customer.last_name}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <span>Email</span>
            <span className="col-span-2 text-right">{customer.email}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <span>Phone</span>
            <span className="col-span-2 text-right">{customer.phone_number}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <span>Address</span>
            <span className="col-span-2 text-right">{address}</span>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="flex flex-col gap-8 max-mobile:gap-6">
        <h3 className="text-xl font-regular uppercase text-black">Payment Information</h3>
        <div className="flex flex-col gap-5 text-sm font-regular">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{currency} {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shippingFee > 0 ? `${currency} ${shippingFee.toFixed(2)}` : 'Free'}</span>
          </div>
          {
            <div className="flex justify-between">
              <span>Tier Discount</span>
              <span>{currency} {tierDiscount > 0 ? (tierDiscount).toFixed(2) : '0.00'}</span>
            </div>
          }
          {
            <div className="flex justify-between">
              <span>Birth Month Discount</span>
              <span>{currency} {birthMonthDiscount > 0 ? (birthMonthDiscount).toFixed(2) : '0.00'}</span>
            </div>
          }
          {
            <div className="flex justify-between">
              <span>Promo Discount</span>
              <span>{currency} {promoDiscount > 0 ? (promoDiscount).toFixed(2) : '0.00'}</span>
            </div>
          }
        </div>

        {/* Total Amount */}
        <div className="flex justify-between items-baseline pt-8 border-t border-black/10 font-regular text-lg max-mobile:text-lg max-mobile:pt-6">
          <div className="flex items-baseline gap-2">
            <span>Total</span>
            <span className=" text-black/40 uppercase">(TAX INCLUDED)</span>
          </div>
          <span>{currency} {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
