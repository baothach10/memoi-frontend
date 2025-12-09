import Link from "next/link";
import MemoiTextLogo from "../atoms/MemoiTextLogo";
import { IconProps } from "@/types";

function Logo({ color, onClose }: IconProps & { onClose?: () => void }) {
  return (
    <>

      <Link href="/" onClick={() => onClose?.()} className="transform smaller-tablet:block hidden">
        <MemoiTextLogo color={color} />
      </Link>
      <Link href="/" onClick={() => onClose?.()} className="transform max-smaller-tablet:block hidden">
        <MemoiTextLogo color={color} width={82} height={18} />
      </Link>

    </>
  );
}

export default Logo;
