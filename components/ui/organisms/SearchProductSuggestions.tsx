'use client';

import { useProductSuggestionsQuery } from "@/queries/useProductSuggestionsQuery";
import SearchInteractiveItem from "../pages/overlay/SearchInteractiveItem";
import { useCurrency } from "@/context/CurrencyContext";



function SearchProductSuggestions({ numberOfSuggestions, gridClassName }: { numberOfSuggestions: number; gridClassName?: string }) {
    const { data: productSuggestions, isLoading, isFetching, isError } = useProductSuggestionsQuery();
    const { currency } = useCurrency();
    if (isLoading || isFetching) {
        return <div className="text-black text-sm max-mobile:text-xs">Loading...</div>;
    }

    if (isError) {
        return <div className="text-black text-sm max-mobile:text-xs">Error loading product suggestions.</div>;
    }

    return (
        <div className="relative w-full h-full">
            <div className={gridClassName || `grid grid-cols-${numberOfSuggestions} gap-2.5`}>
                {productSuggestions && productSuggestions?.length > 0 ?
                    productSuggestions.slice(0, numberOfSuggestions).map((product) => (
                        <SearchInteractiveItem
                            key={product.id}
                            image={product.images[0] || ""}
                            hoveredImage={
                                product.images[1]
                            }
                            id={product.id}
                            name={product.name}
                            currency={currency ?? "SGD"}
                            price={product.price}
                            salePrice={product.sale_price}
                        />
                    )) : <div>No suggestions available.</div>}
            </div>
        </div>
    );
}

export default SearchProductSuggestions