"use client";

import Link from "next/link";

export default function DeleteAccountSection({ onDelete }: { onDelete: () => void }) {
  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className="flex flex-col gap-12 max-mobile:gap-9">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-regular uppercase max-mobile:text-lg">DELETE YOUR ACCOUNT</h2>
        <p className="text-sm text-black/80 max-mobile:text-xs">
          Account deletion is permanent. You will lose access to your account and will no longer be able to track past purchases, returns, or exchanges online.
        </p>
      </div>

      <div className="relative w-full max-w-[375px]">

        <button
          onClick={handleDelete}
          className=" relative
        w-full border border-black/20 py-4 text-sm font-regular
        transition-all duration-300 ease-in-out
        bg-[#fffefa] text-black
        hover:bg-black hover:text-[#fffefa]
        max-mobile:text-xs
        max-mobile:py-3
        "
        >
          Delete account
        </button>
      </div>

      <p className="text-sm text-black/80 leading-relaxed  mt-8 max-mobile:text-xs max-mobile:mt-7">
        At MEMOÍ, your privacy is our priority. We are committed to protecting your data and handling your information with the utmost integrity and security. Learn how we secure your data in our{" "}
        <Link href={"/privacy-policy"} className=" inline cursor-pointer text-black/80 relative underline decoration-black/40 cursor-pointer">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
