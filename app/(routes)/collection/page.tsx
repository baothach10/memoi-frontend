import CollectionLink from "@/components/ui/pages/collection/CollectionLink";
import HeroSection from "@/components/ui/pages/home/HeroSection";
import { COLLECTION_LIST } from "@/constants/collections";

export default function CollectionPage() {
  const heroMedia = {
    type: "image" as const,
    src: "/images/collection-menu.webp",
  };

  return (
    <div className="relative">
      <div
        id="smooth-wrapper"
        className="h-svh overflow-hidden text-sm max-mobile:text-xs"
      >
        <div id="smooth-content">
          <HeroSection
            ref={null}
            media={heroMedia}
            tabletMedia={heroMedia}
            mobileMedia={heroMedia}
          />
        </div>
        <div className="text-white gap-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
          <div className="gap-3 flex flex-col items-center justify-center">
            {COLLECTION_LIST.map((collection) => (
              <div key={collection.season + '-' + collection.slug}>
                <CollectionLink
                  id={collection.season}
                  name={collection.name}
                  href={
                    collection.slug
                      ? `/collection/${collection.slug}`
                      : undefined
                  }
                />
              </div>
            ))}
          </div>
          <div>All collections</div>
        </div>
      </div>
    </div>
  );
}
