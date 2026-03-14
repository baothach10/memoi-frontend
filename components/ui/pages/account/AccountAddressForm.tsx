"use client";

import { useForm } from "react-hook-form";
import Field from "../../molecules/Field";
import ChevronDownIcon from "../../atoms/ChevronDownIcon";
import { getCountries } from "libphonenumber-js";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

import { UserProfileResponse } from "@/app/api/getUserProfile";

countries.registerLocale(en);

type FormValues = {
  country: string;
  // state: string;
  city: string;
  zipCode: string;
  address: string;
  optionalAddress: string;
};

function inputClass() {
  return `w-full border-b bg-transparent pt-4 text-sm outline-none border-black/40 focus:border-black/60 max-mobile:text-xs max-mobile:pt-2`;
}

const buttonClass = `
  w-full border border-black/20 py-4 text-sm font-regular
  transition-all duration-300 ease-in-out
  bg-[#fffefa] text-black
  hover:bg-black hover:text-[#fffefa]
`;

interface AccountAddressFormProps {
  userProfile: UserProfileResponse;
}

export default function AccountAddressForm({ userProfile }: AccountAddressFormProps) {
  const defaultAddress = userProfile.addresses?.[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      country: defaultAddress?.country || "VN",
      // state: defaultAddress?.state || "",
      city: defaultAddress?.city || "",
      zipCode: defaultAddress?.zip_postal_code || "",
      address: defaultAddress?.address_line_1 || "",
      optionalAddress: defaultAddress?.address_line_2 || "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Updating address:", data);
  };

  const COUNTRIES = getCountries()
    .map((country) => ({
      label: countries.getName(country, "en") || country,
      iso: country,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-regular uppercase tracking-tight">ADDRESS INFORMATION</h2>
        <p className="text-sm text-black/60 leading-relaxed font-light">
          Make changes to your address here. Click save when you are done.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
        <div className="flex flex-col gap-12">
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

          {/* STATE */}
          {/* <Field label="STATE *" error={errors.state}>
            <div className="relative flex">
              <select
                className={` appearance-none bg-transparent ${inputClass()}`}
                {...register("state")}
              >
                <option value="">Choose your state</option>
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/4 pointer-events-none">
                <ChevronDownIcon width={16} height={16} />
              </div>
            </div>
          </Field> */}

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

        <button type="submit" className={buttonClass}>
          Save changes
        </button>
      </form>
    </div>
  );
}
