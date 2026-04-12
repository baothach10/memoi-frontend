"use client";

import React, { useEffect, useState } from "react";
import HamburgerMenuIcon from "@/components/ui/atoms/HamburgerMenuIcon";
import ExitIcon from "@/components/ui/atoms/ExitIcon";
import ExpandableSection from "@/components/ui/molecules/ExpandableSection";
import Link from "next/link";
import useIsMobile from "@/hooks/useIsMobile";
import { useHeaderTheme } from "@/hooks/useHeaderTheme";
import { useCategoriesQuery } from "@/queries/useCategoriesQuery";
import { DESKTOP_LOGO_SIZE, MOBILE_LOGO_SIZE } from "@/constants";

type Props = {
  className?: string;
  open?: boolean;
  onToggle?: (open: boolean) => void;
};

export default function MobileMenu({
  className = "",
  open: openProp,
  onToggle,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof openProp === "boolean";
  const theme = useHeaderTheme();
  const open = isControlled ? (openProp as boolean) : internalOpen;
  const isMobile = useIsMobile(768);
  const iconSize = isMobile ? MOBILE_LOGO_SIZE : DESKTOP_LOGO_SIZE;
  const textColor = open || theme === "light" ? "black" : "white";

  const toggle = () => {
    if (isControlled) {
      onToggle?.(!open);
    } else {
      setInternalOpen((v) => {
        const next = !v;
        onToggle?.(next);
        return next;
      });
    }
  };

  const { data: itemsList } = useCategoriesQuery();

  const closeMenu = () => {
    if (isControlled) onToggle?.(false);
    else setInternalOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) document.body.classList.add("menu-open");
    else document.body.classList.remove("menu-open");

    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  return (
    <div className={`relative ${className}`}>
      <div className="flex relative items-center gap-6 max-mobile:gap-5">
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={toggle}
          className="z-10 relative items-center justify-center cursor-pointer max-mobile:flex hidden transition-all ease-in"
        >
          {open ? (
            <ExitIcon width={MOBILE_LOGO_SIZE} height={MOBILE_LOGO_SIZE} color={textColor} />
          ) : (
            <HamburgerMenuIcon width={MOBILE_LOGO_SIZE} height={MOBILE_LOGO_SIZE} color={textColor} />
          )}
        </button>
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={toggle}
          className="z-10 relative flex items-center cursor-pointer justify-center max-mobile:hidden transition-all ease-in"
        >
          {open ? (
            <ExitIcon width={18} height={18} color={textColor} />
          ) : (
            <HamburgerMenuIcon width={18} height={18} color={textColor} />
          )}
        </button>

        <div className={`relative w-[${iconSize}px] h-[${iconSize}px]`}>
          <ExitIcon width={18} height={18} color="transparent" />
        </div>
        <div
          className={`relative w-[${iconSize}px] h-[${iconSize}px] max-tablet:block hidden`}
        >
          <ExitIcon width={18} height={18} color="transparent" />
        </div>
      </div>

      {open && (
        <div className="fixed top-16 max-mobile:top-14 left-0 w-full h-full bg-[#fffefa] text-black">
          <nav className="absolute top-[76px] max-mobile:top-10 h-full w-full overflow-auto">
            <div className="flex flex-col mx-auto">
              <ExpandableSection
                defaultOpen
                className="py-6 px-10 border-b border-b-black/10 max-mobile:px-4 max-mobile:py-4"
                title={
                  <span className="font-regular text-[16px] uppercase max-mobile:text-sm">
                    Collection
                  </span>
                }
              >
                <ul className="text-sm space-y-3 max-mobile:text-xs max-mobile:mt-4 max-tablet:mt-3">
                  <li>
                    <Link
                      href="/collection/ss26-the-becoming"
                      onClick={closeMenu}
                      className=" text-[14px] uppercase max-mobile:text-xs cursor-pointer"
                    >
                      SS26 THE BECOMING
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      onClick={closeMenu}
                      className=" text-[14px] uppercase max-mobile:text-xs cursor-pointer"
                    >
                      FW26 COMING SOON
                    </Link>
                  </li>
                </ul>
              </ExpandableSection>

              <ExpandableSection
                defaultOpen
                className="py-6 px-10 border-b border-b-black/10 max-mobile:px-4 max-mobile:py-4"
                title={
                  <span className="font-regular text-[16px] uppercase max-mobile:text-sm">
                    Shop
                  </span>
                }
              >
                <ul className="text-sm space-y-3 max-mobile:text-xs max-mobile:mt-4 max-tablet:mt-3">
                  {itemsList &&
                    itemsList.map((category) => (
                      <li key={category.id}>
                        <Link
                          className="flex cursor-pointer"
                          href={`/shop/category/${category.name}`}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}

                  <li>
                    <Link
                      className="flex cursor-pointer"
                      href={`/shop/all-products`}
                    >
                      All Products
                    </Link>
                  </li>
                </ul>
              </ExpandableSection>

              <ExpandableSection
                defaultOpen
                className="py-6 px-10 max-mobile:px-4 max-mobile:py-4"
                title={
                  <span className="font-regular text-[16px] uppercase max-mobile:text-sm">
                    Explore
                  </span>
                }
              >
                <ul className="text-sm space-y-3 max-mobile:text-xs max-mobile:mt-4 max-tablet:mt-3">
                  <li>
                    <Link
                      href="/explore/about-us"
                      onClick={closeMenu}
                      className="cursor-pointer"
                    >
                      About us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/the-memoi-house"
                      onClick={closeMenu}
                      className="cursor-pointer"
                    >
                      The MEMOÍ House
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/explore/commitments"
                      onClick={closeMenu}
                      className="cursor-pointer"
                    >
                      Our Commitments
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/explore/contact-us"
                      onClick={closeMenu}
                      className="cursor-pointer"
                    >
                      Contact us
                    </Link>
                  </li>
                </ul>
              </ExpandableSection>
            </div>
            <div className="px-10 flex flex-col gap-4 max-mobile:px-4 max-tablet:pt-8">
              <Link href="#" onClick={closeMenu} className="cursor-pointer">
                <span className="font-regular text-[16px] uppercase max-mobile:text-sm">
                  Shopping cart
                </span>
              </Link>
              <Link href="#" onClick={closeMenu} className="cursor-pointer">
                <span className="font-regular text-[16px] uppercase max-mobile:text-sm">
                  Account
                </span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
