import Link from "next/link";

export const LinkItem = ({ url, title, style }: { url: string; title: string; style?: string }) => (
  <Link
    href={url}
    className={`text-white underline hover:text-gray-200 transition-colors leading-[1.2] decoration-white/40 ${style}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {title}
  </Link>
);
