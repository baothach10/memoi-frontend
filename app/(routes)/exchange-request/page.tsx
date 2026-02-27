"use client";

import { useForm } from "react-hook-form";
import Field from "@/components/ui/molecules/Field";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import ChevronDownIcon from "@/components/ui/atoms/ChevronDownIcon";
import { useState } from "react";
import Footer from "@/components/ui/organisms/Footer";
import { useRouter } from "next/navigation";

countries.registerLocale(en);

type FormValues = {
    email: string;
    phoneZone: string;
    phone: string;
    orderNumber: string;
};

function inputClass() {
    return `
    w-full border-b bg-transparent pt-4 text-sm outline-none border-black/40 focus:border-black/60 max-mobile:text-xs max-mobile:pt-2
  `;
}

export default function ExchangeRequestPage() {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            phoneZone: "+1",
        },
    });

    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

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

    const onSubmit = async (data: FormValues) => {
        setIsPending(true);
        try {
            const response = await fetch("/api/exchange-requests/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ACCESS_TOKEN}`,
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok || responseData.error) {
                const errorMessage = responseData.error || "Failed to submit exchange request";
                setError("orderNumber", { type: "manual", message: errorMessage });
                return;
            }
            reset({
                email: "",
                phoneZone: "+1",
                phone: "",
                orderNumber: "",
            });
            router.push("/exchange-success");
        } catch (error: any) {
            const errorMessage = error?.message || "Failed to submit exchange request";
            console.error(errorMessage);
            setError("orderNumber", { type: "manual", message: errorMessage });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="" data-header-theme="light">
            <section className="flex w-full justify-center py-50 max-mobile:py-38 smaller-tablet:max-tablet:py-73">
                <form
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-[620px] flex flex-col gap-12 max-mobile:px-5 max-mobile:gap-9"
                >
                    <div className="flex flex-col gap-9">
                        <div className="flex flex-col gap-12 max-mobile:gap-9">
                            {/* Header */}
                            <div className="text-center">
                                <h1 className="text-2xl font-regular max-mobile:text-lg">EXCHANGE YOUR ORDER</h1>
                                <p className="text-sm text-black/80 mt-8 max-mobile:text-xs max-mobile:text-left max-mobile:mt-4">
                                    To proceed with your exchange request, please note that we accept exchanges for size only within 7 days of receipt. For full terms and conditions, please refer to our <a className="underline underline-offset-2 decoration-black/80" href="#">Shipping & Exchange Policy</a>
                                </p>
                            </div>

                            {/* EMAIL */}
                            <Field label="EMAIL *" error={errors.email}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className={inputClass()}
                                    {...register("email", {
                                        required: "This field is required ",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                />
                            </Field>

                            {/* PHONE */}
                            <Field label="PHONE NUMBER *" error={errors.phone || errors.phoneZone}>
                                <div className="flex gap-4">
                                    {/* Zone selector */}
                                    <div className="relative flex flex-1 max-mobile:flex-2">
                                        <select
                                            className={` appearance-none ${inputClass()}`}
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

                                    {/* Phone number */}
                                    <input
                                        type="tel"
                                        placeholder="Phone number"
                                        className={`flex-9 max-mobile:flex-8 ${inputClass()}`}
                                        {...register("phone", {
                                            required: "This field is required "
                                        })}
                                    />
                                </div>
                            </Field>

                            {/* ORDER NUMBER */}
                            <Field label="ORDER NUMBER *" error={errors.orderNumber}>
                                <div className="mt-3 text-sm max-mobile:text-xs max-mobile:mt-1">
                                    Your Order Number can be found in your original confirmation email.
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter your order number"
                                    className={inputClass()}
                                    {...register("orderNumber", {
                                        required: "This field is required"
                                    })}
                                />
                            </Field>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 max-mobile:gap-4">
                        {/* Submit */}
                        <button
                            className="bg-black text-white py-4 text-sm"
                            disabled={isPending}
                        >
                            {isPending ? "Submitting..." : "Register an Exchange"}
                        </button>
                    </div>
                </form>
            </section>
            <Footer />
        </div>
    );
}