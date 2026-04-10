import Link from "next/link";

export const LinkItem = ({ url, title, style }: { url: string; title: string; style?: string }) => (
  <Link
    href={url}
    className={`transition-colors cursor-pointer ${style}`}
  >
    {title}
  </Link>
);
