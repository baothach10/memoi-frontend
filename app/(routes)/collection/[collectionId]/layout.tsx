import { getCollectionBySlug } from "@/constants/collections";
import { Metadata } from "next";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ collectionId: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}): Promise<Metadata> {
  const { collectionId } = await params;
  const collection = getCollectionBySlug(collectionId);

  if (!collection) {
    return {
      title: "Collection | MEMOÍ",
      description: "Explore our curated collections at MEMOÍ.",
    };
  }

  return {
    title: collection.metadata.title,
    description: collection.metadata.description,
  };
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
