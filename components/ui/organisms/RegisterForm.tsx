"use client";

import { useForm } from "react-hook-form";
import Field from "../molecules/Field";
import Link from "next/link";

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
    w-full border-b bg-transparent py-1 text-sm outline-none border-black/40 focus:border-black/60
  `;
}

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      phoneZone: "+1",
    },
  });

  const PHONE_ZONES = [
    { code: "+1", label: "US / Canada" },
    { code: "+84", label: "Vietnam" },
    { code: "+61", label: "Australia" },
    { code: "+44", label: "United Kingdom" },
    { code: "+81", label: "Japan" },
    { code: "+82", label: "Korea" },
  ];

  const onSubmit = (data: FormValues) => {
    console.log(data);
    reset(
      {
        email: "",
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
        className="w-full max-w-[620px] flex flex-col gap-9 max-mobile:px-5"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-regular max-mobile:text-lg">CREATE AN ACCOUNT</h1>
          <p className="text-sm text-black/70 mt-2">
            Please fill in the fields below to create your account and get
            access to exclusive services immediately
          </p>
        </div>

        {/* EMAIL */}
        <Field label="EMAIL *" error={errors.email}>
          <input
            type="email"
            placeholder="Enter your email"
            className={inputClass()}
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
          <select
            className={inputClass()}
            {...register("country", { required: true })}
          >
            <option value="">Choose your country</option>
            <option value="VN">Vietnam</option>
            <option value="US">United States</option>
          </select>
        </Field>

        {/* PHONE */}
        <Field label="PHONE NUMBER *" error={errors.phone || errors.phoneZone}>
          <div className="flex gap-4">
            {/* Zone selector */}
            <select
              className={`flex-1 max-mobile:flex-2 ${inputClass()}`}
              {...register("phoneZone", { required: true })}
            >
              <option value="">+Code</option>
              {PHONE_ZONES.map((z) => (
                <option key={z.code} value={z.code}>
                  {z.code}
                </option>
              ))}
            </select>

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
          />
        </Field>

        {/* Terms */}
        <p className="text-xs text-black/70 leading-relaxed">
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
        <label className="flex items-center gap-3 text-xs text-black/70">
          <input
            type="checkbox"
            className="accent-black"
            {...register("marketing")}
          />
          I would like to receive information about the latest updates from
          MEMOI by email.
        </label>

        {/* Submit */}
        <button className="mt-6 bg-black text-white py-4 text-sm">
          Create account
        </button>

        {/* Footer */}
        <p className="text-center text-xs">
          Already have an account?{" "}
          <Link href={"/sign-in"} className="text-sm text-black relative inline-flex leading-2.5 after:absolute after:left-0 after:-bottom-px after:h-px after:w-full after:origin-left after:scale-x-100 after:bg-black/40 cursor-pointer max-mobile:text-xs">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
