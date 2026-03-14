"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useUserQuery } from "@/queries/useUserQuery";
import MemoiGraphicLogo from "../atoms/MemoiGraphicLogo";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SignUpModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: userProfile, isLoading } = useUserQuery();
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide modal on sign-in page
    if (pathname === "/sign-in") {
      setIsOpen(false);
      return;
    }

    if (!isLoading && userProfile && !userProfile.authenticated) {
      const isDismissed = localStorage.getItem("hideSignUpModal");
      if (!isDismissed) {
        setIsOpen(true);
      }
    }
  }, [isLoading, userProfile, pathname]);

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
          localStorage.setItem("hideSignUpModal", "true");
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
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
        className="relative z-10 w-full max-w-[900px] bg-[#fffefa] overflow-hidden shadow-2xl flex md:flex-row h-[600px] md:min-h-[600px]"
      >
        {/* Close Button */}
        <button
          onClick={() => handleClose(true)}
          className="absolute top-6 right-6 z-20 text-black/50 hover:text-black transition-colors"
          aria-label="Close modal"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 4L4 12M4 4l8 8" />
          </svg>
        </button>

        {/* Left Side: Image */}
        <div className="relative w-1/2 h-full overflow-hidden">
          <Image
            src="/images/collection-becoming-gallery-look-1.webp"
            alt="MEMOÍ High Fashion"
            fill
            className="object-cover relative w-full h-full"
            priority
          />
        </div>

        {/* Right Side: Content */}
        <div className="relative w-1/2 py-8 px-13 flex flex-col items-center justify-between text-center bg-[#fffefa]">
          <div>
            <MemoiGraphicLogo width={49} height={32} />
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="px-5">
              <p className="text-sm leading-normal text-black/80">
                Join The MEMOÍ House and immediately receive SGD 10 off your first purchase!
              </p>
            </div>

            <Link
              href="/sign-in"
              onClick={() => handleClose(true)}
              className=" block border border-black/20 py-3 px-8 text-xs tracking-widest leading-normal uppercase bg-transparent text-black hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
            >
              Sign up
            </Link>
          </div>

          <div>
            <p className="text-xs tracking-widest text-black/60 leading-normal uppercase">
              Copyright © 2025 MEMOÍ, LLC
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
