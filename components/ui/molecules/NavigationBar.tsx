import Link from "next/link";

function NavigationBar({ className = "" }: { className?: string }) {
  return (
    <nav className={`flex items-center gap-16 text-sm ${className}`}>
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
