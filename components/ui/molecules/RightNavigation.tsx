import Link from "next/link";
import SearchIcon from "../atoms/SearchIcon";
import CartIcon from "../atoms/CartIcon";
import UserIcon from "../atoms/UserIcon";

function RightNavigation({ color = "white", onClose }: { color?: string; onClose?: () => void }) {

  return (
    <div className="flex items-center gap-6 max-mobile:gap-4">

      <Link href="#" onClick={() => onClose?.()} className="text-white hover:text-gray-300 transition-all ease-in">
        <SearchIcon width={14} height={14} color={color} />
      </Link>
      <Link href="#" onClick={() => onClose?.()} className="text-white hover:text-gray-300 transition-all ease-in" >
        <CartIcon width={14} height={14} color={color} />
      </Link>
      <Link href="#" onClick={() => onClose?.()} className="text-white hover:text-gray-300 transition-all ease-in">
        <UserIcon width={14} height={14} color={color} />
      </Link>
    </div>
  );
}

export default RightNavigation;
