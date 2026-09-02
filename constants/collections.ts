type MediaContent = {
  type: "image" | "video";
  src: string;
};

export type CollectionDetail = {
  slug: string;
  season: string;
  name: string;
  shopCollectionName: string;
  shopUrl: string;
  shopLinkTitle: string;
  metadata: {
    title: string;
    description: string;
  };
  hero: {
    desktop: MediaContent;
    tablet: MediaContent;
    mobile: MediaContent;
  };
  campaignGrid: {
    desktop: MediaContent[];
    tablet: MediaContent[];
    mobile: MediaContent[];
  };
  intro: {
    heading: string;
    body: string;
  };
  midSection: string;
  slideShow: string[];
  closingSection: string;
  slider: string[];
};

export type CollectionListItem = {
  season: string;
  name: string;
  slug?: string;
};

const image = (src: string): MediaContent => ({ type: "image", src });

export const COLLECTIONS: Record<string, CollectionDetail> = {
  "the-becoming": {
    slug: "the-becoming",
    season: "SS26",
    name: "THE BECOMING",
    shopCollectionName: "The-Becoming",
    shopUrl: "/shop/collection/The-Becoming",
    shopLinkTitle: "Shop the collection",
    metadata: {
      title: "The Becoming | Our First Collection | MEMOÍ",
      description:
        'Discover "The Becoming," the debut collection from MEMOÍ. A journey of quiet confidence, fluid silhouettes, and intentional design for the modern woman.',
    },
    hero: {
      desktop: image("/images/desktop-first-collection.webp"),
      tablet: image("/images/tablet-first-collection.webp"),
      mobile: image("/images/mobile-first-collection.webp"),
    },
    campaignGrid: {
      desktop: [
        image("/images/desktop-collection-becoming-campaign-1.webp"),
        image("/images/desktop-collection-becoming-campaign-2.webp"),
      ],
      tablet: [
        image("/images/tablet-collection-becoming-campaign-1.webp"),
        image("/images/tablet-collection-becoming-campaign-2.webp"),
      ],
      mobile: [
        image("/images/mobile-collection-becoming-campaign-1.webp"),
        image("/images/mobile-collection-becoming-campaign-2.webp"),
      ],
    },
    intro: {
      heading: "SS26 THE BECOMING",
      body: '"The Becoming" is not simply a collection, but a reflection of a journey, where identity unfolds quietly through uncertainty, growth, and the courage to begin before feeling fully ready. This first collection of MEMOÍ was never about perfection, but about becoming slowly, intentionally, and truthfully, shaped by discipline, persistence, and the unseen moments in between.',
    },
    midSection:
      "Each piece embodies this transformation in motion. A balance of softness and structure, with fluid silhouettes that are delicate yet certain, minimal yet deeply considered. Designed not to change who you are, but to bring you closer to yourself to who you are becoming.",
    slideShow: [
      "/images/collection-becoming-gallery-look-1.webp",
      "/images/collection-becoming-gallery-look-2.webp",
      "/images/collection-becoming-gallery-look-3.webp",
      "/images/collection-becoming-gallery-look-4.webp",
      "/images/collection-becoming-gallery-look-5.webp",
    ],
    closingSection:
      'More than reinvention, "The Becoming" is a return to clarity, to presence, to a deeper sense of self. Created for the modern woman who moves with quiet confidence, this collection invites you to embrace your own rhythm and step into each moment with ease because not everything needs to be loud to be seen. Some things arrive softly.',
    slider: [
      "/images/collection-becoming-slider-look-1.webp",
      "/images/collection-becoming-slider-look-2.webp",
      "/images/collection-becoming-slider-look-3.webp",
      "/images/collection-becoming-slider-look-4.webp",
    ],
  },
  "the-silk-edition": {
    slug: "the-silk-edition",
    season: "SS26",
    name: "THE SILK EDITION",
    shopCollectionName: "The-Silk-Edition",
    shopUrl: "/shop/collection/The-Silk-Edition",
    shopLinkTitle: "Shop the collection",
    metadata: {
      title: "The Silk Edition | Our Second Collection | MEMOÍ",
      description:
        "Discover THE SILK EDITION by MEMOÍ - a collection defined by fluid silhouettes, serene pastels, and effortless luxury. Shop timeless silk pieces designed to move with you.",
    },
    hero: {
      desktop: image("/images/desktop-first-collection.webp"),
      tablet: image("/images/tablet-first-collection.webp"),
      mobile: image("/images/mobile-first-collection.webp"),
    },
    campaignGrid: {
      desktop: [
        image("/images/desktop-collection-becoming-campaign-1.webp"),
        image("/images/desktop-collection-becoming-campaign-2.webp"),
      ],
      tablet: [
        image("/images/tablet-collection-becoming-campaign-1.webp"),
        image("/images/tablet-collection-becoming-campaign-2.webp"),
      ],
      mobile: [
        image("/images/mobile-collection-becoming-campaign-1.webp"),
        image("/images/mobile-collection-becoming-campaign-2.webp"),
      ],
    },
    intro: {
      heading: "SS26 THE SILK EDITION",
      body: "After exploring the idea of becoming, MEMOÍ enters a softer chapter with THE SILK EDITION — inspired by femininity, ease, and the quiet beauty of silk in motion. In pastel pink, serene green, and creamy ivory, each piece captures softness through movement, light, and fluid form. Here, luxury is not about excess, but about how effortlessly a garment makes you feel.",
    },
    midSection:
      "Fluid silhouettes, gentle draping, and delicate details move naturally with the body, balancing timeless femininity with MEMOÍ’s modern spirit. Designed to feel effortless rather than elaborate, each piece lets silk speak through texture, movement, and light.",
    slideShow: [
      "/images/collection-becoming-gallery-look-1.webp",
      "/images/collection-becoming-gallery-look-2.webp",
      "/images/collection-becoming-gallery-look-3.webp",
      "/images/collection-becoming-gallery-look-4.webp",
      "/images/collection-becoming-gallery-look-5.webp",
    ],
    closingSection:
      "More than a seasonal collection, THE SILK EDITION continues the story of the woman she is becoming — this time through softness. Created for slow days, lingering moments, and everything in between, each piece carries an ease that feels intimate, timeless, and personal. Because femininity does not always need to be defined. Sometimes, it is simply felt.",
    slider: [
      "/images/collection-becoming-slider-look-1.webp",
      "/images/collection-becoming-slider-look-2.webp",
      "/images/collection-becoming-slider-look-3.webp",
      "/images/collection-becoming-slider-look-4.webp",
    ],
  },
};

export const COLLECTION_LIST: CollectionListItem[] = [
  { season: "SS26", name: "The Becoming", slug: "the-becoming" },
  { season: "SS26", name: "The Silk Edition", slug: "the-silk-edition" },
  { season: "FW26", name: "Coming soon" },
];

export function getCollectionBySlug(
  slug: string,
): CollectionDetail | undefined {
  return Object.values(COLLECTIONS).find(
    (collection) => collection.slug === slug,
  );
}
