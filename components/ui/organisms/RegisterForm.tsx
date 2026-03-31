"use client";

import { useForm } from "react-hook-form";
import Field from "../molecules/Field";
import Link from "next/link";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { useCreateUser } from "@/queries/useCreateUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import ChevronDownIcon from "../atoms/ChevronDownIcon";
import { toast } from "react-toastify";


countries.registerLocale(en);

type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  phoneZone: string;
  phone: string;
  dob: string;
  marketing: boolean;
};

function inputClass() {
  return `
    w-full border-b bg-transparent pt-4 text-sm outline-none border-black/40 focus:border-black/60 max-mobile:text-xs max-mobile:pt-2
  `;
}

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      phoneZone: "+1",
    },
  });
  const { mutate, isPending, error } = useCreateUser();
  const router = useRouter();

  // Fetch user email from Supabase on mount
  useEffect(() => {
    const fetchUserEmail = async () => {
      const supabase = createBrowserSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser(); 
      if (user?.email) {
        setValue("email", user.email);
      }
    };

    fetchUserEmail();
  }, [setValue]);

  // Format date input with auto-slash insertion
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    let formattedValue = "";

    if (value.length > 0) {
      formattedValue = value.slice(0, 2); // dd
      if (value.length >= 3) {
        formattedValue += "/" + value.slice(2, 4); // dd/mm
        if (value.length >= 5) {
          formattedValue += "/" + value.slice(4, 8); // dd/mm/yyyy
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

  const COUNTRIES = getCountries().map((country) => ({
    label: countries.getName(country, "en") ? countries.getName(country, "en") : country,
    iso: country,
  })).sort((a, b) => a.label && b.label ? a.label.localeCompare(b.label) : 0);


  const onSubmit = (data: FormValues) => {
    mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        country: data.country,
        phone: data.phone,
        phoneZone: data.phoneZone,
        dob: data.dob,
        marketing: data.marketing,
      },
      {
        onSuccess: () => {
          // ✅ Show toast then redirect to home after successful auth / registration
          toast.success("Profile updated successfully");
          router.replace("/");
        },
        onError: (err: any) => {
          const message = err?.message.error || "Unable to create account";
          toast.error(message);
        },
      }
    );
    reset(
      {
        firstName: "",
        lastName: "",
        country: "",
        phoneZone: "+1",
        phone: "",
        dob: "",
        marketing: false,
      },
      {
        keepErrors: false,
        keepDirty: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false,
      }
    );
  };

  return (
    <div className="flex w-full justify-center">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[620px] flex flex-col gap-12 max-mobile:px-5 max-mobile:gap-9"
      >
        <div className="flex flex-col gap-9">
          <div className="flex flex-col gap-12 max-mobile:gap-9">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-regular max-mobile:text-lg">CREATE AN ACCOUNT</h1>
              <p className="text-sm text-black/70 mt-8 max-mobile:text-xs max-mobile:text-left max-mobile:mt-4">
                Please fill in the fields below to create your account and get
                access to exclusive services immediately
              </p>
            </div>

            {/* EMAIL */}
            <Field label="EMAIL *" error={errors.email}>
              <input
                type="email"
                className={inputClass()}
                disabled
                {...register("email", { required: true })}
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
          </div>

          <div className="flex flex-col gap-3">

            {/* Terms */}
            <p className="text-sm text-black/70 leading-relaxed text-left max-mobile:text-xs">
              By clicking Create account, I confirm that I have read and accept the{" "}
              <Link href={"/"} className="text-sm text-black relative inline-flex leading-2.5 after:absolute after:left-0 after:-bottom-px after:h-px after:w-full after:origin-left after:scale-x-100 after:bg-black cursor-pointer max-mobile:text-xs">
                Terms & Condition
              </Link>{" "}
              and understand the information regarding the use of my personal
              details as explained in the{" "}
              <Link href={"/"} className="text-sm text-black relative inline-flex leading-2.5 after:absolute after:left-0 after:-bottom-px after:h-px after:w-full after:origin-left after:scale-x-100 after:bg-black cursor-pointer max-mobile:text-xs">
                Privacy Policy
              </Link>
              .
            </p>

            {/* Marketing */}
            <label className="flex items-start text-left gap-3 text-sm text-black/70 max-mobile:text-xs">
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
              I would like to receive information about the latest updates from
              MEMOI by email.
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-6 max-mobile:gap-4">
          {/* Submit */}
          <button className="bg-black text-white py-4 text-sm">
            {isPending ? "Creating..." : "Create account"}
          </button>

          {/* Footer */}
          <p className="text-center text-sm max-mobile:text-xs">
            Already have an account?{" "}
            <Link href={"/sign-in"} className="text-sm text-black relative inline-flex leading-2.5 after:absolute after:left-0 after:-bottom-px after:h-px after:w-full after:origin-left after:scale-x-100 after:bg-black/40 cursor-pointer max-mobile:text-xs">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
