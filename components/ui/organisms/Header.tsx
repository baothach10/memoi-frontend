"use client"
import NavigationBar from "../molecules/NavigationBar";
import Logo from "../molecules/Logo";
import RightNavigation from "../molecules/RightNavigation";
import { useState } from "react";
import MobileMenu from "../molecules/MobileMenu";
import { useMenu } from "@/context/MenuContext";
import { useHeaderTheme } from "@/hooks/useHeaderTheme";

export function Header() {
  const ctx = useMenu()
  const theme = useHeaderTheme();
  const [localOpen, setLocalOpen] = useState(false)

  const menuOpen = ctx ? ctx.open : localOpen
  const setMenuOpen = ctx ? ctx.setOpen : setLocalOpen
  const textColor = menuOpen || theme === "light" ? "black" : "white";
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${menuOpen ? 'bg-[#fffefa]' : 'bg-transparent'} pt-10 max-mobile:py-4 max-mobile:px-5`}>

      <div className="px-[100px] smaller-tablet:max-tablet:px-10 max-mobile:px-0 flex items-center justify-between transition-all ease-in">
        <MobileMenu open={menuOpen} onToggle={setMenuOpen} className="max-tablet:block hidden" />
        <Logo color={textColor} onClose={() => setMenuOpen(false)} />
        <NavigationBar className="max-tablet:hidden block" inlineColor={textColor} />
        <RightNavigation color={textColor} onClose={() => setMenuOpen(false)} />
      </div>
    </header>
  );
}

