import Image from "next/image";
import Link from "next/link";

function Logo() {
  return (
    <Link href="/" className="transform -translate-y-1/2">
      <Image width={109} height={24} src={"/logo.svg"} alt="logo icon" />
    </Link>
  );
}

export default Logo;
