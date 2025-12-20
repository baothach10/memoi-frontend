import { LinkItem } from "../../atoms/LinkItem";

type ShopCollectionHeroDetailProps = {
  id: string;
  title: string;
  numberOfItems: number;
  urlTitle?: string;
  url?: string;
};

function ShopCollectionHeroDetail({
  id,
  title,
  numberOfItems,
  urlTitle,
  url,
}: ShopCollectionHeroDetailProps) {
  return (
    <div className="absolute bottom-10 left-0 right-0 z-10 px-8 max-mobile:bottom-5">
      <div className="mx-auto text-center space-y-2">
        <div className="text-white text-[1rem] leading-[1.2] gap-3 max-mobile:text-sm">
          <div className="flex flex-wrap justify-center gap-4 leading-[1.2]">
            <div
              className={`uppercase text-white hover:text-gray-200 transition-colors leading-[1.2] decoration-white/40`}
            >
              {id}
            </div>
            <div
              className={`uppercase text-white hover:text-gray-200 transition-colors leading-[1.2] decoration-white/40 `}
            >
              {title}
            </div>
          </div>
        </div>
        <div className="text-white/60">{numberOfItems} products</div>
        {urlTitle && url && (
          <LinkItem
            url={url}
            title={urlTitle}
            style="underline underline-offset-4 decoration-white/40"
          />
        )}
      </div>
    </div>
  );
}

export default ShopCollectionHeroDetail;
