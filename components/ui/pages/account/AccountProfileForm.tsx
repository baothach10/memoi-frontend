import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import Field from "../../molecules/Field";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import ChevronDownIcon from "../../atoms/ChevronDownIcon";

import { UserProfileResponse } from "@/app/api/getUserProfile";
import { useUpdatePersonalInfo } from "@/queries/useUpdatePersonalInfo";
import Link from "next/link";
import { toast } from "react-toastify";

countries.registerLocale(en);

type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  phoneZone: string;
  phone: string;
  dob: string;
  marketing: boolean;
};

function inputClass() {
  return `w-full border-b bg-transparent pt-4 text-sm outline-none border-black/40 focus:border-black/60 max-mobile:text-xs max-mobile:pt-2 max-mobile:pb-1`;
}

const buttonClass = `
  w-full border border-black/20 py-4 leading-none text-sm cursor-pointer font-regular
  transition-all duration-300 ease-in-out
  bg-[#fffefa] text-black
  hover:bg-black hover:text-[#fffefa]
  max-mobile:text-xs
  max-mobile:py-3
`;



interface AccountProfileFormProps {
  userProfile: UserProfileResponse;
}

export default function AccountProfileForm({ userProfile }: AccountProfileFormProps) {
  const user = userProfile.user;
  const queryClient = useQueryClient();
  const { mutate: updateProfile, isPending } = useUpdatePersonalInfo();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: user?.email || "",
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      phoneZone: user?.phone_country_code || "+1",
      phone: user?.phone_number || "",
      dob: user?.date_of_birth,
      marketing: user?.marketing_opt_in || false,
    },
  });

  const onSubmit = (data: FormValues) => {
    updateProfile(
      {
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phone,
        phone_country_code: data.phoneZone,
        date_of_birth: data.dob,
        marketing_opt_in: data.marketing,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["userProfile"] });
          toast.success("Profile updated successfully.");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update profile.");
        },
      }
    );
  };

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    let formattedValue = "";
    if (value.length > 0) {
      formattedValue = value.slice(0, 2);
      if (value.length >= 3) {
        formattedValue += "/" + value.slice(2, 4);
        if (value.length >= 5) {
          formattedValue += "/" + value.slice(4, 8);
        }
      }
    }
    e.target.value = formattedValue;
    setValue("dob", formattedValue);
  };


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



  return (
    <div className="flex flex-col gap-12 max-mobile:gap-9">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-regular uppercase max-mobile:text-lg">PROFILE</h2>
        <p className="text-sm text-black/60 max-mobile:text-xs">
          Make changes to your profile here. Click save when you are done.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12 max-mobile:gap-9">
        <div className="flex flex-col gap-12 max-mobile:gap-9">
          {/* EMAIL */}
          <Field label="EMAIL *" error={errors.email}>
            <input
              type="email"
              placeholder="Enter your email"
              className={`${inputClass()} text-black/40 cursor-not-allowed`}
              disabled
              {...register("email")}
            />
          </Field>

          {/* FIRST NAME */}
          <Field label="FIRST NAME *" error={errors.firstName}>
            <input
              type="text"
              placeholder="Enter your first name"
              className={inputClass()}
              {...register("firstName", { required: true })}
            />
          </Field>

          {/* LAST NAME */}
          <Field label="LAST NAME *" error={errors.lastName}>
            <input
              type="text"
              placeholder="Enter your last name"
              className={inputClass()}
              {...register("lastName", { required: true })}
            />
          </Field>


          {/* PHONE */}
          <Field label="PHONE NUMBER *" error={errors.phone || errors.phoneZone}>
            <div className="flex gap-4">
              <div className="relative flex flex-1 max-mobile:flex-2">
                <select
                  className={`appearance-none bg-transparent ${inputClass()}`}
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

          {/* DOB */}
          <Field label="DATE OF BIRTH *" error={errors.dob}>
            <input
              type="text"
              placeholder="dd / mm / yyyy"
              className={inputClass()}
              {...register("dob", {
                required: "Date of birth is required",
                pattern: {
                  value:
                    /^(0[1-9]|[12][0-9]|3[01])\s*\/\s*(0[1-9]|1[0-2])\s*\/\s*(19|20)\d{2}$/,
                  message: "Please enter a valid date in dd/mm/yyyy format",
                },
              })}
              onChange={handleDateInput}
            />
          </Field>

          {/* Marketing */}
          <label className="flex items-start gap-3 text-sm text-black font-light cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                className="peer appearance-none w-4 h-4 border border-black/60 bg-transparent transition-all cursor-pointer"
                {...register("marketing")}
              />
              <svg
                className="absolute w-4 h-4 text-black/60 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="text-sm max-mobile:text-xs text-black">
              I would like to receive information about the latest updates from MEMOÍ by email. By submitting I agree to the MEMOÍ{" "}
              <Link href={"/privacy-policy"} className=" inline relative underline decoration-black/40 cursor-pointer underline-offset-4">
                Privacy Policy
              </Link>
            </div>
          </label>
        </div>

        <button type="submit" className={buttonClass} disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
