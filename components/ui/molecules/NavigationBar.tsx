import Link from "next/link";
import React from "react";

function NavigationBar() {
  return (
    <nav className="flex items-center gap-16 ">
      <Link
        href="/collection"
        className="text-white hover:text-gray-300 transition"
      >
        Collection
      </Link>
      <Link href="/shop" className="text-white hover:text-gray-300 transition">
        Shop
      </Link>
      <Link
        href="/explore"
        className="text-white hover:text-gray-300 transition"
      >
        Explore
      </Link>
    </nav>
  );
}

export default NavigationBar;
