"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { HeaderWrapper } from "../molecules/HeaderWrapper";

export default function ConditionalHeader() {
  const pathname = usePathname();

  // Hide header on sign-in and register pages
  const hideHeader = pathname === "/sign-in";

  if (hideHeader) {
    return null;
  }

  return (
    <HeaderWrapper>
      <Header />
    </HeaderWrapper>
  );
}
