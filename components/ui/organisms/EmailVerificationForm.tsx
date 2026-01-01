"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ErrorModal from "../molecules/ErrorModal";
import Link from "next/link";
import { sendOTP, verifyOTP } from "@/app/api/auth/action";

type FormValues = {
  code: string[];
};

interface Props {
  email: string;
}

export default function EmailVerificationForm({ email }: Props) {
  const { handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      code: Array(6).fill(""),
    },
  });

  async function handleVerifyOtp(formData: FormData) {
    const res = await verifyOTP(formData)
    if (res?.error) setErrorOpen(true);
  }

  async function handleSendOtp(formData: FormData) {
    const res = await sendOTP(formData)
    if (res?.error) setErrorOpen(true);
  }


  const inputsRef = useRef<HTMLInputElement[]>([]);
  const code = watch("code");
  const [seconds, setSeconds] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "") // keep digits only
      .slice(0, 6);       // max 6 digits

    if (!pastedData) return;

    const digits = pastedData.split("");

    digits.forEach((digit, index) => {
      setValue(`code.${index}`, digit);
    });

    // Clear remaining inputs if pasted less than 6 digits
    for (let i = digits.length; i < 6; i++) {
      setValue(`code.${i}`, "");
    }

    // Focus next input or last one
    const focusIndex = Math.min(digits.length, 5);
    inputsRef.current[focusIndex]?.focus();
  };


  /* Countdown */
  useEffect(() => {
    if (seconds <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  /* Mask email */
  const maskedEmail = email.replace(
    /^(.)(.*)(@.*)$/,
    (_, first, middle, domain) =>
      middle.length > 0
        ? first + "*".repeat(middle.length) + domain
        : "*" + domain
  );

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("email", email);
    const otp = data.code.join("");
    formData.append("token", otp);
    console.log("OTP:", otp);
    handleVerifyOtp(formData)
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    setValue(`code.${index}`, value);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    if (!canResend) return;
    const formData = new FormData();
    formData.append("email", email);
    console.log("Resending code to:", email);
    // Reset timer and disable resend again
    setSeconds(60);
    handleSendOtp(formData)
    setCanResend(false);
  };

  const handleErrorClose = () => {
    setErrorOpen(false);
    // Clear all code inputs
    setValue("code", Array(6).fill(""));
    // Focus first input
    inputsRef.current[0]?.focus();
  };

  const handleInputClick = () => {
    // Find the first empty input or focus the first one
    const firstEmptyIndex = code.findIndex((digit) => !digit);
    const targetIndex = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
    inputsRef.current[targetIndex]?.focus();
  };

  return (
    <div className="relative flex w-full h-full items-center justify-center">
      <ErrorModal open={errorOpen} onClose={handleErrorClose} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex flex-col w-full h-full text-center gap-12"
      >
        {/* Header */}
        <div className="gap-3">
          <h1 className="text-2xl font-regular tracking-wide max-mobile:text-lg">
            ENTER THE CODE
          </h1>
          <p className="text-sm text-black/80 max-mobile:text-xs">
            Complete your last step to sign in
          </p>
        </div>

        {/* Body */}
        <div className="relative flex flex-col w-full h-full gap-10 px-12 max-mobile:px-5">
          <p className="text-sm text-black/70 max-mobile:text-xs">
            We have sent a code to the email address
            <br />
            <span className="font-medium">{maskedEmail}</span>
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <input
                key={i}
                ref={(el) => {
                  if (el) inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={code[i] || ""}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
                onClick={handleInputClick}
                className="w-10 border-b border-black/20 bg-transparent text-center text-lg outline-none focus:border-black/60"
              />
            ))}
          </div>

          {/* Continue */}
          <button
            type="submit"
            className="w-full bg-black text-white py-4 text-sm hover:opacity-90 transition max-mobile:text-xs"
          >
            Continue
          </button>

          {/* Resend */}
          {canResend ? (
            <button
              type="button"
              onClick={handleResendCode}
              className="text-sm text-black hover:opacity-70 transition font-regular max-mobile:text-xs"
            >
              Request new code
            </button>
          ) : (
            <p className="text-sm text-black/70 max-mobile:text-xs">
              Request new code in <span className="font-medium">{seconds}</span>{" "}
              seconds
            </p>
          )}
        </div>

        {/* Footer */}
        <Link
          href={"/"}
          className="text-sm underline cursor-pointer max-mobile:text-xs"
        >
          Need help?
        </Link>
      </form>
    </div>
  );
}
