"use client";

import Link from "next/link";
import MemoiGraphicLogo from "../../atoms/MemoiGraphicLogo";
import LoginForm from "../../organisms/LoginForm";

function SignInPortal() {
  return (
    <section className="relative w-full h-full flex flex-col items-center justify-between py-10 max-mobile:py-14">
      <Link className="relative cursor-pointer" href={"/"}>
        <MemoiGraphicLogo />
      </Link>
      <div className="relative max-w-[471px]">
        <LoginForm />
      </div>
      <div className="relative text-sm max-mobile:text-xs">
        Copyright &copy; 2025 MEMOI ™
      </div>
    </section>
  );
}

export default SignInPortal;
