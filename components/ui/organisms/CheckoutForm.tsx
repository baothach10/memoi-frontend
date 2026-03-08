"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Field from "@/components/ui/molecules/Field";
import CheckoutSummary from "@/components/ui/molecules/CheckoutSummary";
import ChevronDownIcon from "@/components/ui/atoms/ChevronDownIcon";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { UserProfileResponse } from "@/app/api/getUserProfile";
import StripePayment from "@/components/ui/organisms/StripePayment";

countries.registerLocale(en);

type CheckoutFormValues = {
    email: string;
    firstName: string;
    lastName: string;
    country: string;
    state: string;
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
    const [billingConfirmed, setBillingConfirmed] = useState(false);

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
            // state: defaultAddress?.state || "",
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

    const handleConfirmBilling = async () => {
        const isValid = await trigger();
        if (isValid) {
            setBillingConfirmed(true);
        }
    };

    return (
        <div className="w-full grid grid-cols-10 gap-20 max-tablet:grid-cols-1 max-tablet:gap-12">
            {/* LEFT — Billing Form + Payment */}
            <div className="col-span-6 max-tablet:col-span-1 flex flex-col gap-10 max-mobile:gap-8">
                {/* Billing Address Section */}
                <div className="flex flex-col gap-10 max-mobile:gap-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-regular uppercase max-mobile:text-lg">
                            Billing Address
                        </h1>
                        {billingConfirmed && (
                            <button
                                type="button"
                                onClick={() => setBillingConfirmed(false)}
                                className="text-sm text-black/60 underline underline-offset-2 hover:text-black transition-colors"
                            >
                                Edit
                            </button>
                        )}
                    </div>

                    <div className={`flex flex-col gap-10 max-mobile:gap-8 ${billingConfirmed ? "opacity-50 pointer-events-none" : ""}`}>
                        {/* EMAIL */}
                        <Field label="EMAIL *" error={errors.email}>
                            <input
                                type="email"
                                className={inputClass()}
                                disabled
                                {...register("email", { required: true })}
                            />
                        </Field>

                        {/* FIRST NAME + LAST NAME */}
                        <div className="grid grid-cols-2 gap-8 max-mobile:grid-cols-1 max-mobile:gap-8">
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

                        {/* STATE */}
                        {/* <Field label="STATE *" error={errors.state}>
                            <div className="relative flex">
                                <select
                                    className={`pb-0.5 appearance-none w-full ${inputClass()}`}
                                    {...register("state", { required: true })}
                                >
                                    <option value="">Choose your state</option>
                                </select>
                                <div className="absolute right-0 top-1/2 -translate-y-1/4 pointer-events-none">
                                    <ChevronDownIcon width={16} height={16} />
                                </div>
                            </div>
                        </Field> */}

                        {/* CITY + ZIP */}
                        <div className="grid grid-cols-2 gap-8 max-mobile:grid-cols-1 max-mobile:gap-8">
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

                        {/* PHONE */}
                        <Field label="PHONE NUMBER *" error={errors.phone || errors.phoneZone}>
                            <div className="flex gap-4">
                                <div className="relative flex flex-1 max-mobile:flex-2">
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

                    {/* Next Button — validates billing before showing payment */}
                    {!billingConfirmed && (
                        <button
                            type="button"
                            onClick={handleConfirmBilling}
                            className="w-fit bg-black text-white py-4 px-16 text-sm tracking-wider hover:opacity-90 transition max-mobile:w-full"
                        >
                            Next
                        </button>
                    )}
                </div>

                {/* Payment Method — only shown after billing is confirmed */}
                {billingConfirmed && (
                    <div className="flex flex-col gap-6 pt-4 border-t border-black/10">
                        <h2 className="text-2xl font-regular uppercase max-mobile:text-lg">
                            Payment Method
                        </h2>
                        <StripePayment />
                    </div>
                )}
            </div>

            {/* RIGHT — Summary */}
            <div className="col-span-4 max-tablet:col-span-1 max-tablet:order-first">
                <CheckoutSummary />
            </div>
        </div>
    );
}
