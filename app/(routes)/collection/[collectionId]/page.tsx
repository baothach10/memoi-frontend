"use client";

import CollectionDetailView from "@/components/ui/pages/collection/CollectionDetailView";
import { getCollectionBySlug } from "@/constants/collections";
import { notFound, useParams } from "next/navigation";

function CollectionDetailPage() {
  const { collectionId } = useParams();
  const collection = getCollectionBySlug(collectionId as string);

  if (!collection) {
    notFound();
  }

  return <CollectionDetailView collection={collection} />;
}

export default CollectionDetailPage;
