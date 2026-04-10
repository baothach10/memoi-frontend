import Link from "next/link";
import MemoiTextLogo from "../atoms/MemoiTextLogo";
import { IconProps } from "@/types";

function Logo({ color, onClose, className }: IconProps & { onClose?: () => void; className?: string }) {
  return (
    <div className={className}>
      <Link href="/" onClick={() => onClose?.()} className="transform smaller-tablet:block hidden transition-all ease-in cursor-pointer">
        <MemoiTextLogo color={color} />
      </Link>
      <Link href="/" onClick={() => onClose?.()} className="transform max-smaller-tablet:block hidden transition-all ease-in cursor-pointer">
        <MemoiTextLogo color={color} width={82} height={18} />
      </Link>
    </div>
  );
}

export default Logo;
