'use client';

import { useProductSuggestionsQuery } from "@/queries/useProductSuggestionsQuery";
import ShopInteractiveItem from "../pages/shop/ShopInteractiveItem";



function ProductDetailsSuggestions({ numberOfSuggestions }: { numberOfSuggestions: number }) {
    const { data: productSuggestions, isLoading, isFetching, isError } = useProductSuggestionsQuery();

    if (isLoading || isFetching) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading product suggestions.</div>;
    }

    return (
        <div className="relative w-full h-full">
            <div className={`grid grid-cols-${numberOfSuggestions} gap-2.5`}>
                {productSuggestions && productSuggestions?.length > 0 ?
                    productSuggestions.slice(0, numberOfSuggestions).map((product) => (
                        <ShopInteractiveItem
                            key={product.id}
                            image={product.images[0] || ""}
                            hoveredImage={
                                product.images[1]
                            }
                            id={product.id}
                            name={product.name}
                            currency={"SGD"}
                            price={product.price}
                        />
                    )) : <div>No suggestions available.</div>}
            </div>
        </div>
    );
}

export default ProductDetailsSuggestions