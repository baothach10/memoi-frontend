import { useHeaderTheme } from "@/hooks/useHeaderTheme";
import Link from "next/link";

function NavigationBar({
  className = "",
  inlineColor = "white",
}: {
  className?: string;
  inlineColor?: string;
}) {
  const theme = useHeaderTheme();

  const underlineColor =
    theme === "dark" ? "after:bg-white/40" : "after:bg-black/40";

  const linkClass = `
    leading-[18px]
    relative
    after:absolute
    after:left-0
    after:-bottom-px
    after:h-px
    cursor-pointer
    after:w-full
    after:origin-left
    after:scale-x-0
    after:transition-transform
    after:duration-200
    hover:after:scale-x-100
    ${underlineColor}
  `;

  return (
    <nav
      className={`flex items-center gap-16 text-sm ${className}`}
      style={{ color: inlineColor }}
    >
      <Link href="/collection" className={linkClass}>
        Collection
      </Link>

      <Link href="/shop" className={linkClass}>
        Shop
      </Link>

      <Link href="/explore" className={linkClass}>
        Explore
      </Link>
    </nav>
  );
}

export default NavigationBar;
