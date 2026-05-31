"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useUserQuery } from "@/queries/useUserQuery";
import MemoiGraphicLogo from "../atoms/MemoiGraphicLogo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_LOGO_SIZE } from "@/constants";
import ExitIcon from "../atoms/ExitIcon";

export default function SignUpModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: userProfile, isLoading } = useUserQuery();
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // If on sign-in or register page, ensure the modal is closed.
  // Updating state during render is a recommended pattern in React for adjusting state based on "prop" changes (like pathname).
  const isExcludedPage = pathname === "/sign-in" || pathname === "/register";
  if (isOpen && isExcludedPage) {
    setIsOpen(false);
  }

  useEffect(() => {
    // If on an excluded page, don't attempt to open the modal.
    if (isExcludedPage) return;

    if (!isLoading && userProfile && !userProfile.authenticated) {
      const isDismissed = sessionStorage.getItem("hideSignUpModal");
      // Only trigger an update if it's not already open.
      if (!isDismissed && !isOpen) {
        // Use a timeout to move the state update out of the synchronous execution of the effect.
        // This satisfies the strict lint rule and prevents cascading render performance issues.
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, userProfile, isExcludedPage, isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Animation when opening
      const tl = gsap.timeline();
      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );
      tl.fromTo(
        contentRef.current,
        { scale: 0.95, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.3"
      );
    }
  }, [isOpen]);

  const handleClose = (persist = false) => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(false);
        if (persist) {
          sessionStorage.setItem("hideSignUpModal", "true");
        }
      },
    });
    tl.to(contentRef.current, {
      scale: 0.95,
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: "power2.in",
    });
    tl.to(
      overlayRef.current,
      { opacity: 0, duration: 0.3, ease: "power2.in" },
      "-=0.2"
    );
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-100 flex items-center justify-center p-4 laptop:p-6"
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        onClick={() => handleClose(true)}
      />

      {/* Modal Container */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-[900px] bg-[#fffefa] overflow-hidden shadow-2xl flex laptop:flex-row h-[600px] laptop:min-h-[600px] max-tablet:flex-col max-tablet:h-auto max-tablet:px-8 max-tablet:pt-8 max-tablet:pb-12 max-tablet:max-w-[494px] max-mobile:p-4"
      >
        {/* Close Button */}
        <button
          onClick={() => handleClose(true)}
          className="absolute top-6 right-6 max-tablet:top-4 max-tablet:right-4 cursor-pointer z-20 text-black/50 hover:text-black transition-colors"
          aria-label="Close modal"
        >
          <ExitIcon width={MOBILE_LOGO_SIZE} height={MOBILE_LOGO_SIZE} color={'black'} />
        </button>

        {/* Left Side: Image */}
        <div className="relative hidden laptop:block w-1/2 h-full overflow-hidden">
          <Image
            src="/images/pop-up.webp"
            alt="MEMOÍ High Fashion"
            fill
            className="object-cover relative w-full h-full"
            priority
          />
        </div>

        {/* Right Side: Content */}
        <div className="relative w-1/2 py-8 px-13 flex flex-col items-center justify-between text-center bg-[#fffefa] max-tablet:w-full max-tablet:py-0 max-tablet:px-0 max-tablet:pt-4">
          <div className="hidden laptop:block">
            <MemoiGraphicLogo width={49} height={32} />
          </div>

          <div className="flex flex-col items-center gap-6 laptop:gap-6">
            <div className="flex flex-col gap-4 laptop:px-5">
              <h2 className="text-xl laptop:hidden font-regular tracking-tight text-black max-tablet:text-sm">
                Get 10% off today!
              </h2>
              <p className="text-sm leading-relaxed text-black/80 w-full max-tablet:text-xs">
                Join The MEMOÍ House and enjoy 10% off your for first purchase!
              </p>
            </div>

            <Link
              href="/sign-in"
              onClick={() => handleClose(true)}
              className="w-full laptop:w-auto border cursor-pointer leading-none border-black/20 py-4 px-12 laptop:px-8 text-sm bg-transparent text-black hover:bg-black hover:text-white transition-all duration-300 ease-in-out max-tablet:text-xs max-mobile:py-3"
            >
              Sign up
            </Link>
          </div>

          <div className="hidden laptop:block">
            <p className="text-xs text-black/60 leading-normal">
              Copyright &copy; 2025 MEMOÍ ™
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
