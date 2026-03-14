"use client";

import { useForm } from "react-hook-form";
import Field from "../../molecules/Field";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import ChevronDownIcon from "../../atoms/ChevronDownIcon";

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
  return `w-full border-b bg-transparent pt-4 pb-2 text-sm outline-none border-black/40 focus:border-black/60 max-mobile:text-xs max-mobile:pt-2`;
}

const buttonClass = `
  w-full border border-black py-4 text-[10px] uppercase tracking-[0.2em] font-regular
  transition-all duration-300 ease-in-out
  bg-[#fffefa] text-black
  hover:bg-black hover:text-[#fffefa]
`;

export default function AccountProfileForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "thanhngo@gmail.com", // Mock data for now
      firstName: "Ngo",
      lastName: "Duong",
      phoneZone: "+84",
      phone: "912345678",
      dob: "13/03/2000",
      marketing: true,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Updating profile:", data);
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
          { code },
        ];
      })
    ).values()
  ).sort((a, b) => a.code.localeCompare(b.code));

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-regular uppercase tracking-tight">PROFILE</h2>
        <p className="text-sm text-black/60 leading-relaxed font-light">
          Make changes to your profile here. Click save when you are done.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
        <div className="flex flex-col gap-12">
          {/* EMAIL */}
          <Field label="EMAIL *" error={errors.email}>
            <input
              type="email"
              className={`${inputClass()} text-black/40 cursor-not-allowed`}
              disabled
              {...register("email")}
            />
          </Field>

          {/* FIRST NAME */}
          <Field label="FIRST NAME *" error={errors.firstName}>
            <input
              type="text"
              className={inputClass()}
              {...register("firstName", { required: true })}
            />
          </Field>

          {/* LAST NAME */}
          <Field label="LAST NAME *" error={errors.lastName}>
            <input
              type="text"
              className={inputClass()}
              {...register("lastName", { required: true })}
            />
          </Field>

          {/* PHONE */}
          <Field label="PHONE NUMBER *" error={errors.phone || errors.phoneZone}>
            <div className="flex gap-4">
              <div className="relative flex min-w-[80px]">
                <select
                  className={`appearance-none bg-transparent ${inputClass()}`}
                  {...register("phoneZone", { required: true })}
                >
                  {PHONE_ZONES.map((z) => (
                    <option key={z.code} value={z.code}>
                      {z.code}
                    </option>
                  ))}
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDownIcon width={12} height={12} />
                </div>
              </div>
              <input
                type="tel"
                className={inputClass()}
                {...register("phone", { required: true })}
              />
            </div>
          </Field>

          {/* DOB */}
          <Field label="DATE OF BIRTH *" error={errors.dob}>
            <input
              type="text"
              className={inputClass()}
              {...register("dob", { required: true })}
              onChange={handleDateInput}
            />
          </Field>

          {/* Marketing */}
          <label className="flex items-center gap-3 text-sm text-black font-light cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                className="peer appearance-none w-4 h-4 border border-black/20 checked:bg-black transition-all"
                {...register("marketing")}
              />
              <svg 
                className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            I would like to receive information about the latest updates from MEMOÍ by email. By submitting I agree to the MEMOÍ Privacy Policy
          </label>
        </div>

        <button type="submit" className={buttonClass}>
          Save changes
        </button>
      </form>
    </div>
  );
}
