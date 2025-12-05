import Link from "next/link";
import Image from "next/image";

function RightNavigation() {
  return (
    <div className="flex items-center gap-6">
      <Link href="#" className="text-white hover:text-gray-300 transition">
        <Image width={14} height={14} src={"/search.svg"} alt="search icon" />
      </Link>
      <Link href="#" className="text-white hover:text-gray-300 transition">
        <Image width={14} height={14} src={"/cart.svg"} alt="cart icon" />
      </Link>
      <Link href="#" className="text-white hover:text-gray-300 transition">
        <Image width={14} height={14} src={"/profile.svg"} alt="profile icon" />
      </Link>
    </div>
  );
}

export default RightNavigation;
