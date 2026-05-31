"use client";
import NavigationBar from "../molecules/NavigationBar";
import Logo from "../molecules/Logo";
import RightNavigation from "../molecules/RightNavigation";
import { useState } from "react";
import MobileMenu from "../molecules/MobileMenu";
import { useMenu } from "@/context/MenuContext";
import { useHeaderTheme } from "@/hooks/useHeaderTheme";
import useViewportInfo from "@/hooks/useViewportInfo";

export function Header() {
  const ctx = useMenu();
  const theme = useHeaderTheme();
  const { mounted, isPortrait } = useViewportInfo();
  const [localOpen, setLocalOpen] = useState(false);
  const hasTouch =
    typeof window !== "undefined" &&
    (navigator.maxTouchPoints > 0 ||
      (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) ||
      "ontouchstart" in window);

  const menuOpen = ctx ? ctx.open : localOpen;
  const setMenuOpen = ctx ? ctx.setOpen : setLocalOpen;
  const textColor = menuOpen || theme === "light" ? "black" : "white";

  const headerBgClass = menuOpen
    ? "bg-[#fffefa]"
    : theme === "light"
      ? "bg-white/20 backdrop-blur-xs"
      : "bg-transparent pointer-events-none";

  const useMobileHeader = mounted && isPortrait && hasTouch;

  return (
    <header
      className={`fixed w-screen top-0 left-0 right-0 z-50 ${headerBgClass} pt-10 pb-6 max-mobile:py-8`}
    >
      <div className="relative w-full px-[100px] smaller-tablet:max-tablet:px-10 max-mobile:px-4 flex items-center justify-between transition-all ease-in">
        <MobileMenu
          open={menuOpen}
          onToggle={setMenuOpen}
          className={`${useMobileHeader ? "block" : "hidden"} pointer-events-auto`}
        />
        <Logo color={textColor} onClose={() => setMenuOpen(false)} className="pointer-events-auto" />
        <NavigationBar
          className={`${useMobileHeader ? "hidden" : "block"} pointer-events-auto`}
          inlineColor={textColor}
        />
        <RightNavigation color={textColor} onClose={() => setMenuOpen(false)} className="pointer-events-auto" />
      </div>
    </header>
  );
}
