import Link from "next/link";

export const LinkItem = ({ url, title, style }: { url: string; title: string; style?: string }) => (
  <Link
    href={url}
    className={`hover:text-gray-200 transition-colors leading-[1.2] ${style}`}
  >
    {title}
  </Link>
);
