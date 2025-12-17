import Link from "next/link";

function NavigationBar({ className = "", inlineColor = 'white' }: { className?: string, inlineColor?: string }) {
  return (
    <nav className={`flex items-center gap-16 text-sm ${className} transition-all ease-in`} style={{ color: inlineColor }}>
      <Link
        href="/collection"
        className=" hover:text-gray-300"
      >
        Collection
      </Link>
      <Link href="/shop" className=" hover:text-gray-300">
        Shop
      </Link>
      <Link
        href="/explore"
        className=" hover:text-gray-300"
      >
        Explore
      </Link>
    </nav>
  );
}

export default NavigationBar;
