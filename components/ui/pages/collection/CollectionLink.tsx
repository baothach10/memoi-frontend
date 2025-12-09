import Link from "next/link";
import React from "react";

interface CollectionLinkProps {
  id: string;
  name: string;
  href: string;
}

function CollectionLink({ id, name, href }: CollectionLinkProps) {
  return (
    <Link href={href}>
      <div className="flex gap-2.5">
        <span className="uppercase font-bold">{id}</span>
        <span className="uppercase opacity-40">{name}</span>
      </div>
    </Link>
  );
}

export default CollectionLink;
