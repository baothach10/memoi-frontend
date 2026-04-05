import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import Field from "../../molecules/Field";
import ChevronDownIcon from "../../atoms/ChevronDownIcon";
import { getCountries } from "libphonenumber-js";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

import { UserProfileResponse } from "@/app/api/getUserProfile";
import { useAddressInfoQuery } from "@/queries/useAddressInfoQuery";
import { useUpdatePersonalInfo } from "@/queries/useUpdatePersonalInfo";
import { toast } from "react-toastify";

countries.registerLocale(en);

type FormValues = {
  country: string;
  city: string;
  zipCode: string;
  address: string;
  optionalAddress: string;
};

function inputClass() {
  return `w-full border-b bg-transparent pt-4 text-sm outline-none border-black/40 focus:border-black/60 max-mobile:text-xs max-mobile:pt-2 max-mobile:pb-1`;
}

const buttonClass = `
  w-full border border-black/20 py-4 text-sm font-regular
  transition-all duration-300 ease-in-out
  bg-[#fffefa] text-black
  hover:bg-black hover:text-[#fffefa]
  max-mobile:text-xs
  max-mobile:py-3
`;

interface AccountAddressFormProps {
  userProfile: UserProfileResponse;
}

export default function AccountAddressForm({ userProfile }: AccountAddressFormProps) {
  const queryClient = useQueryClient();
  const { data: addressInfo, isLoading } = useAddressInfoQuery();
  const { mutate: updateAddress, isPending } = useUpdatePersonalInfo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      country: addressInfo?.country || "VN",
      city: addressInfo?.city || "",
      zipCode: addressInfo?.zip_code || "",
      address: addressInfo?.address || "",
      optionalAddress: addressInfo?.optional_address || "",
    },
  });

  useEffect(() => {
    if (addressInfo) {
      reset({
        country: addressInfo.country || "VN",
        city: addressInfo.city || "",
        zipCode: addressInfo.zip_code || "",
        address: addressInfo.address || "",
        optionalAddress: addressInfo.optional_address || "",
      });
    }
  }, [addressInfo, reset]);

  const onSubmit = (data: FormValues) => {
    updateAddress(
      {
        country: data.country,
        city: data.city,
        zip_code: data.zipCode,
        address: data.address,
        optional_address: data.optionalAddress,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["userAddressInfo"] });
          toast.success("Address updated successfully.");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update address.");
        },
      }
    );
  };

  const COUNTRIES = getCountries()
    .map((country) => ({
      label: countries.getName(country, "en") || country,
      iso: country,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="flex flex-col gap-12 max-mobile:gap-9">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-regular uppercase max-mobile:text-lg">ADDRESS INFORMATION</h2>
        <p className="text-sm text-black/60 max-mobile:text-xs">
          Make changes to your address here. Click save when you are done.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12 max-mobile:gap-9">
        <div className="flex flex-col gap-12 max-mobile:gap-9">
          {/* COUNTRY */}
          <Field label="COUNTRY *" error={errors.country}>
            <div className="relative flex">
              <select
                className={` appearance-none bg-transparent ${inputClass()}`}
                {...register("country", { required: true })}
              >
                <option value="">Select country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.iso} value={c.iso}>
                    {c.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/4 pointer-events-none">
                <ChevronDownIcon width={16} height={16} />
              </div>
            </div>
          </Field>


          {/* CITY */}
          <Field label="CITY *" error={errors.city}>
            <input
              type="text"
              placeholder="Enter your city"
              className={inputClass()}
              {...register("city", { required: true })}
            />
          </Field>

          {/* ZIP */}
          <Field label="ZIP/ POSTAL CODE *" error={errors.zipCode}>
            <input
              type="text"
              placeholder="Enter your postal code"
              className={inputClass()}
              {...register("zipCode", { required: true })}
            />
          </Field>

          {/* ADDRESS */}
          <Field label="ADDRESS *" error={errors.address}>
            <input
              type="text"
              placeholder="Enter your address"
              className={inputClass()}
              {...register("address", { required: true })}
            />
          </Field>

          {/* OPTIONAL */}
          <Field label="OPTIONAL ADDRESS" error={errors.optionalAddress}>
            <input
              type="text"
              placeholder="Enter your optional address"
              className={inputClass()}
              {...register("optionalAddress")}
            />
          </Field>
        </div>

        <button type="submit" className={buttonClass} disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
