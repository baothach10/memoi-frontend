"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const tl = gsap.timeline();
      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );
      tl.fromTo(
        contentRef.current,
        { scale: 0.95, opacity: 0, y: 10 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.4)" },
        "-=0.2"
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: onClose,
    });
    tl.to(contentRef.current, {
      scale: 0.95,
      opacity: 0,
      y: 10,
      duration: 0.3,
      ease: "power2.in",
    });
    tl.to(
      overlayRef.current,
      { opacity: 0, duration: 0.2, ease: "power2.in" },
      "-=0.1"
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/30"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-[450px] bg-[#fffefa] p-8 flex flex-col items-center text-center gap-10 shadow-2xl max-mobile:p-4 max-mobile:gap-8 max-tablet:max-w-[494px]"
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-[16px] font-regular text-black max-mobile:text-sm">
            Confirm account deletion
          </h3>
          <p className="text-sm text-black/80 px-4 max-mobile:text-xs">
            Are you sure you want to leave The MEMOÍ House? This action will
            permanently delete your account and all order history.
          </p>
        </div>

        <div className="flex gap-4 w-full">
          <button
            onClick={onConfirm}
            className="flex-1 border border-black/10 py-4 leading-none cursor-pointer text-sm font-regular transition-all hover:bg-black hover:text-white max-mobile:py-3 max-mobile:text-xs"
          >
            Delete
          </button>
          <button
            onClick={handleClose}
            className="flex-1 bg-black text-white py-4 leading-none cursor-pointer text-sm font-regular transition-all hover:bg-black/80 max-mobile:text-xs max-mobile:py-3"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
