import Link from "next/link";

export const LinkItem = ({ url, title }: { url: string; title: string }) => (
  <Link
    href={url}
    className="text-white underline hover:text-gray-200 transition-colors"
    target="_blank"
    rel="noopener noreferrer"
  >
    {title}
  </Link>
);
