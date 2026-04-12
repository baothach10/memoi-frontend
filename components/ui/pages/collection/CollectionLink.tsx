import Link from "next/link";

interface CollectionLinkProps {
  id: string;
  name: string;
  href?: string;
}

function CollectionLink({ id, name, href }: CollectionLinkProps) {
  const content = (
    <div className="gap-2.5 group inline-flex leading-[18px]">
      <span className="uppercase font-bold relative after:absolute after:left-0 after:-bottom-px after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:opacity-40 after:transition-transform after:duration-200 group-hover:after:scale-x-100">
        {id}
      </span>
      <span className="uppercase opacity-40 relative after:absolute after:left-0 after:-bottom-px after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 group-hover:after:scale-x-100">
        {name}
      </span>
    </div>
  );

  const notAllowedContent = (
    <div className="gap-2.5 group inline-flex leading-[18px] ">
      <span className="uppercase font-bold relative">
        {id}
      </span>
      <span className="uppercase relative opacity-40">
        {name}
      </span>
    </div>
  );

  if (!href) {
    return (
      <div className="cursor-not-allowed">
        {notAllowedContent}
      </div>
    )
  }

  return (
    <Link href={href} className="cursor-pointer">
      {content}
    </Link>
  );
}

export default CollectionLink;
