import Image from "next/image";
import Link from "next/link";

function Logo() {
  return (
    <Link href="/" className="transform">
      <Image width={100} height={22} src={"/logo.svg"} alt="logo icon" />
    </Link>
  );
}

export default Logo;
