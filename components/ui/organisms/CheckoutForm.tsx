"use client";

import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Field from "@/components/ui/molecules/Field";
import CheckoutSummary, { 
    SummaryHeader, 
    SummaryItems, 
    SummaryPromo, 
    SummaryTotals, 
    SummaryTotalAmount, 
    SummaryActions, 
    MobileSummaryTotalAmount
} from "@/components/ui/molecules/CheckoutSummary";
import ChevronDownIcon from "@/components/ui/atoms/ChevronDownIcon";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { UserProfileResponse } from "@/app/api/getUserProfile";
import StripePayment from "@/components/ui/organisms/StripePayment";
import { PaymentFormRef } from "@/components/ui/molecules/PaymentForm";
import { CartItem, getCartItems } from "@/utils/cartUtils";

countries.registerLocale(en);

const SHIPPING_METHODS = [
    {
        id: "express",
        title: "2 TO 3 BUSINESS DAYS",
        description: "Express Courier (Air)",
        price: "FREE",
        priceValue: 0,
    },
    // {
    //     id: "standard",
    //     title: "5 TO 7 BUSINESS DAYS",
    //     description: "Standard Shipping (Sea)",
    //     price: "SGD 10.00",
    //     priceValue: 10,
    // },
];

type CheckoutFormValues = {
    email: string;
    firstName: string;
    lastName: string;
    country: string;
    city: string;
    zipCode: string;
    address: string;
    optionalAddress: string;
    phoneZone: string;
    phone: string;
};

function inputClass() {
    return `
    w-full border-b bg-transparent pt-4 text-sm outline-none border-black/40 focus:border-black/60 max-mobile:text-xs max-mobile:pt-2
  `;
}

interface CheckoutFormProps {
    userProfile: UserProfileResponse;
}

export default function CheckoutForm({ userProfile }: CheckoutFormProps) {
    const user = userProfile.user;
    const defaultAddress = userProfile.addresses?.[0];
    const paymentRef = useRef<PaymentFormRef>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedShippingId, setSelectedShippingId] = useState(
        SHIPPING_METHODS[0].id
    );
    const [items, setItems] = useState<CartItem[]>([]);
    const [promoCode, setPromoCode] = useState("");

    useEffect(() => {
        setItems(getCartItems());

        const handleUpdate = () => setItems(getCartItems());
        window.addEventListener("cartUpdated", handleUpdate);
        return () => window.removeEventListener("cartUpdated", handleUpdate);
    }, []);

    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const selectedShipping =
        SHIPPING_METHODS.find((m) => m.id === selectedShippingId) ||
        SHIPPING_METHODS[0];

    const updateLocalStorage = (newItems: CartItem[]) => {
        setItems(newItems);
        localStorage.setItem("itemList", JSON.stringify(newItems));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        updateLocalStorage(newItems);
    };

    const updateQuantity = (index: number, delta: number) => {
        const newItems = items.map((item, i) => {
            if (i === index) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        });
        updateLocalStorage(newItems);
    };

    const {
        register,
        trigger,
        formState: { errors },
    } = useForm<CheckoutFormValues>({
        mode: "onChange",
        defaultValues: {
            email: user?.email || "",
            firstName: user?.first_name || "",
            lastName: user?.last_name || "",
            country: user?.country || "",
            city: defaultAddress?.city || "",
            zipCode: defaultAddress?.zip_postal_code || "",
            address: defaultAddress?.address_line_1 || "",
            optionalAddress: defaultAddress?.address_line_2 || "",
            phoneZone: user?.phone_country_code || "+1",
            phone: user?.phone_number || "",
        },
    });

    const PHONE_ZONES = Array.from(
        new Map(
            getCountries().map((country) => {
                const code = `+${getCountryCallingCode(country)}`;
                return [
                    code,
                    {
                        iso: country,
                        label: countries.getName(country, "en") ?? country,
                        code,
                    },
                ];
            })
        ).values()
    ).sort((a, b) => a.label.localeCompare(b.label));

    const COUNTRIES = getCountries()
        .map((country) => ({
            label: countries.getName(country, "en")
                ? countries.getName(country, "en")
                : country,
            iso: country,
        }))
        .sort((a, b) =>
            a.label && b.label ? a.label.localeCompare(b.label) : 0
        );

    const handlePlaceOrder = async () => {
        const isValid = await trigger();
        if (!isValid) return;

        if (!paymentRef.current) return;

        setIsProcessing(true);
        await paymentRef.current.confirmPayment();
        setIsProcessing(false);
    };

    return (
        <div className="w-full grid grid-cols-10 gap-20 max-tablet:flex max-tablet:flex-col max-tablet:gap-12 max-mobile:gap-5">

            {/* TOP MOBILE — items and totals */}
            <div className="laptop:hidden flex flex-col max-tablet:gap-8 max-mobile:gap-5">
                {items.length > 0 && (
                    <SummaryItems
                        items={items}
                        onRemove={removeItem}
                        onIncrease={(idx) => updateQuantity(idx, 1)}
                        onDecrease={(idx) => updateQuantity(idx, -1)}
                    />
                )}
                <MobileSummaryTotalAmount total={subtotal + selectedShipping.priceValue} />
            </div>


            {/* LEFT — Personal Info + Billing + Payment */}
            <div className="col-span-6 max-tablet:col-span-1 flex flex-col gap-10 max-tablet:gap-12 max-tablet:pt-8 max-tablet:border-t max-tablet:border-black/10 max-mobile:gap-16">
                {/* Personal Information */}
                <div className="flex flex-col gap-10 max-tablet:gap-12 max-mobile:gap-9">
                    <h1 className="text-2xl font-regular uppercase max-mobile:text-lg">
                        Personal Information
                    </h1>

                    {/* FIRST NAME + LAST NAME */}
                    <div className="grid grid-cols-2 gap-8 max-mobile:grid-cols-1 max-mobile:gap-9">
                        <Field label="FIRST NAME *" error={errors.firstName}>
                            <input
                                type="text"
                                placeholder="Enter your first name"
                                className={inputClass()}
                                {...register("firstName", { required: true })}
                            />
                        </Field>
                        <Field label="LAST NAME *" error={errors.lastName}>
                            <input
                                type="text"
                                placeholder="Enter your last name"
                                className={inputClass()}
                                {...register("lastName", { required: true })}
                            />
                        </Field>
                    </div>

                    {/* EMAIL + PHONE */}
                    <div className="grid grid-cols-2 gap-8 max-mobile:grid-cols-1 max-mobile:gap-9">
                        <Field label="EMAIL *" error={errors.email}>
                            <input
                                type="email"
                                className={inputClass()}
                                placeholder="Enter your email"
                                disabled={!!user?.email}
                                {...register("email", { required: true })}
                            />
                        </Field>
                        <Field label="PHONE NUMBER *" error={errors.phone || errors.phoneZone}>
                            <div className="flex gap-4">
                                <div className="relative flex flex-1 max-mobile:flex-2 min-w-16">
                                    <select
                                        className={`appearance-none ${inputClass()}`}
                                        {...register("phoneZone", { required: true })}
                                    >
                                        <option value="">+Code</option>
                                        {PHONE_ZONES.map((z) => (
                                            <option key={z.code + z.label} value={z.code}>
                                                {z.code}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/4 pointer-events-none">
                                        <ChevronDownIcon width={16} height={16} />
                                    </div>
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Phone number"
                                    className={`flex-9 max-mobile:flex-8 ${inputClass()}`}
                                    {...register("phone", { required: true })}
                                />
                            </div>
                        </Field>
                    </div>
                </div>

                {/* Billing Address */}
                <div className="flex flex-col gap-10 max-mobile:gap-9 max-tablet:gap-12">
                    <h2 className="text-2xl font-regular uppercase max-mobile:text-lg">
                        Billing Address
                    </h2>

                    {/* COUNTRY */}
                    <Field label="COUNTRY *" error={errors.country}>
                        <div className="relative flex">
                            <select
                                className={`pb-0.5 appearance-none w-full ${inputClass()}`}
                                {...register("country", { required: true })}
                            >
                                <option value="">Choose your country</option>
                                {COUNTRIES.map((z) => (
                                    <option key={z.iso + z.label} value={z.iso}>
                                        {z.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-0 top-1/2 -translate-y-1/4 pointer-events-none">
                                <ChevronDownIcon width={16} height={16} />
                            </div>
                        </div>
                    </Field>


                    {/* CITY + ZIP */}
                    <div className="grid grid-cols-2 gap-8 max-mobile:grid-cols-1 max-mobile:gap-9">
                        <Field label="CITY *" error={errors.city}>
                            <input
                                type="text"
                                placeholder="Enter your city"
                                className={inputClass()}
                                {...register("city", { required: true })}
                            />
                        </Field>
                        <Field label="ZIP/ POSTAL CODE *" error={errors.zipCode}>
                            <input
                                type="text"
                                placeholder="Enter your postal code"
                                className={inputClass()}
                                {...register("zipCode", { required: true })}
                            />
                        </Field>
                    </div>

                    {/* ADDRESS */}
                    <Field label="ADDRESS *" error={errors.address}>
                        <input
                            type="text"
                            placeholder="Enter your address"
                            className={inputClass()}
                            {...register("address", { required: true })}
                        />
                    </Field>

                    {/* OPTIONAL ADDRESS */}
                    <Field label="OPTIONAL ADDRESS" error={errors.optionalAddress}>
                        <input
                            type="text"
                            placeholder="Enter your optional address"
                            className={inputClass()}
                            {...register("optionalAddress")}
                        />
                    </Field>
                </div>

                {/* Shipping Method */}
                <div className="flex flex-col gap-10 max-mobile:gap-8 max-tablet:gap-12">
                    <h2 className="text-2xl font-regular uppercase max-mobile:text-lg">
                        Shipping Method
                    </h2>
                    <div className="flex flex-col gap-4">
                        {SHIPPING_METHODS.map((method) => (
                            <div
                                key={method.id}
                                onClick={() => setSelectedShippingId(method.id)}
                                className={`flex justify-between items-center border p-6 max-mobile:p-4 cursor-pointer transition-all duration-300 ${selectedShippingId === method.id
                                    ? "border-black bg-black/[0.02]"
                                    : "border-black/20 hover:border-black/40"
                                    }`}
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-bold uppercase tracking-wider max-mobile:text-xs">
                                        {method.title}
                                    </span>
                                    <span className="text-xs text-black/60">
                                        {method.description}
                                    </span>
                                </div>
                                <span className="text-sm font-regular uppercase max-mobile:text-xs">
                                    {method.price}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Method */}
                <div className="flex flex-col gap-12 max-mobile:gap-8">
                    <h2 className="text-2xl font-regular uppercase max-mobile:text-lg">
                        Payment Method
                    </h2>
                    <StripePayment ref={paymentRef} />
                </div>
            </div>

            {/* RIGHT — Summary */}
            <div className="col-span-4 max-tablet:hidden">
                <CheckoutSummary
                    onPlaceOrder={handlePlaceOrder}
                    isProcessing={isProcessing}
                    shippingCost={selectedShipping.priceValue}
                    shippingLabel={selectedShipping.price}
                />
            </div>

            {/* BOTTOM MOBILE — promo, totals and place order button */}
            <div className="laptop:hidden flex flex-col gap-10">
                <div className="flex flex-col gap-8">
                    <SummaryPromo
                        promoCode={promoCode}
                        setPromoCode={setPromoCode}
                    />
                    <SummaryTotals
                        subtotal={subtotal}
                        shippingLabel={selectedShipping.price}
                    />
                    <SummaryTotalAmount total={subtotal + selectedShipping.priceValue} />
                </div>

                <SummaryActions
                    onPlaceOrder={handlePlaceOrder}
                    isProcessing={isProcessing}
                />
            </div>
        </div>
    );
}
