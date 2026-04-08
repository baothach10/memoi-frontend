"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import GoogleIcon from "../atoms/GoogleIcon";
import EmailVerificationForm from "./EmailVerificationForm";
import Link from "next/link";
import { loginWithGoogle, sendOTP } from "@/app/(routes)/auth/action";

type FormValues = {
  email: string;
};

export default function LoginForm() {
  const [showVerification, setShowVerification] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("email", data.email);
    setSubmittedEmail(data.email);
    setShowVerification(true);
    handleSendOtp(formData)
  };

  async function handleSendOtp(formData: FormData) {
    await sendOTP(formData)
  }

  // Show verification form if email was submitted
  if (showVerification && submittedEmail) {
    return <EmailVerificationForm email={submittedEmail} />;
  }

  return (
    <div className="relative flex w-full h-full items-center justify-center ">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex flex-col w-full h-full text-center gap-12 max-mobile:gap-9"
      >
        <div className="gap-3">
          <h1 className="text-2xl tracking-wide font-regular max-mobile:text-lg">
            LOG IN OR REGISTER
          </h1>
          <p className="text-sm text-black/80 max-mobile:text-xs">
            For more privileges
          </p>
        </div>

        <div className="relative flex flex-col w-full h-full gap-9 px-12 max-mobile:px-5">
          <div className="relative flex flex-col w-full h-full">
            {/* Email input */}
            <div className="relative flex flex-col w-full h-full justify-center items-center text-left pb-8">
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full border-b bg-transparent text-sm outline-none leading-10 border-black/40 max-mobile:text-xs focus:border-black/60`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {/* Error message */}
              {errors.email && (
                <div className="relative h-8 w-full flex items-center">
                  <div className=" flex items-left gap-1 text-red-600 text-sm max-mobile:text-xs">
                    <AlertCircle size={14} />
                    <span>{errors.email.message}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Continue button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-4 text-sm hover:cursor-pointer transition max-mobile:text-xs"
            >
              Continue
            </button>
          </div>

          {/* OR */}
          <div className="text-[16px] text-black/80 max-mobile:text-sm">OR</div>

          <div className="flex flex-col relative gap-4">
            {/* Google */}
            <button
              type="button"
              className="w-full border py-4 text-sm flex items-center justify-center gap-2 hover:cursor-pointer transition max-mobile:text-xs"
              onTouchEnd={loginWithGoogle}
              onClick={loginWithGoogle}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Footer */}
            <p className=" text-sm text-black/80 leading-[150%] max-mobile:text-xs">
              By logging in with my social login, I agree to link my account in
              accordance with the{" "}
              <Link href={"/"} className="text-sm text-black relative inline-flex  cursor-pointer max-mobile:text-xs">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
        <div>

          <Link
            href={"/"}
            className="text-sm text-black relative inline-flexcursor-pointer max-mobile:text-xs"
          >
            Need help?
          </Link>
        </div>
      </form>
    </div >
  );
}
