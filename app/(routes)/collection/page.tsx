import CollectionLink from "@/components/ui/pages/collection/CollectionLink";
import HeroSection from "@/components/ui/pages/home/HeroSection";

// Main Home Component
export default function CollectionPage() {
  const exampleWithLinks = {
    media: {
      type: "image" as const,
      src: "/images/collection-menu.webp",
    },
    tabletMedia: {
      type: "image" as const,
      src: "/images/collection-menu.webp",
    },
    mobileMedia: {
      type: "image" as const,
      src: "/images/collection-menu.webp",
    },
  };

  const collectionsList = [
    { id: "SS26", name: "Her Edge" },
    { id: "SS27", name: "Summer Summer" },
    { id: "SS28", name: "Reborn" },
  ];

  return (
    <div className="relative">
      <div id="smooth-wrapper" className="h-screen overflow-hidden">
        <div id="smooth-content">
          <HeroSection ref={null} media={exampleWithLinks.media} tabletMedia={exampleWithLinks.tabletMedia} mobileMedia={exampleWithLinks.mobileMedia} />
        </div>
        <div className="text-white gap-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
          <div className="gap-3 flex flex-col items-center justify-center">
            {collectionsList.map((collection) => (
              <div key={collection.id}>
                <CollectionLink
                  id={collection.id}
                  name={collection.name}
                  href="/collection"
                />
              </div>
            ))}
          </div>
          <div className="text-[16px]">All collections</div>
        </div>
      </div>
    </div>
  );
}
