export interface CartItem {
  product_id: string | number; // Support variant IDs (strings) or product IDs (numbers)
  size: string;
  productImage: string;
  color_name: string;
  productName: string;
  sale_price?: number;
  price: number;
  quantity: number;
  stock: number;
} 

export const getCartItems = (): CartItem[] => {
  try {
    const itemList = localStorage.getItem("products");
    if (itemList) {
      const parsed = JSON.parse(itemList);
      // Support both new { products: [...] } and old [...] format during transition
      const items = Array.isArray(parsed) ? parsed : parsed.products;
      if (Array.isArray(items)) {
        return items;
      }
    }
  } catch (error) {
    console.error("Error reading cart items:", error);
  }
  return [];
};

export const setCartItems = (items: CartItem[]) => {
  try {
    const storageData = {
      products: items.length > 0 ? items : []
    };
    localStorage.setItem("products", JSON.stringify(storageData));
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.error("Error saving cart items:", error);
  }
};

export const addItemToCart = (newItem: CartItem) => {
  const items = getCartItems();
  const existingIndex = items.findIndex(
    (item) => item.product_id === newItem.product_id && item.size === newItem.size
  );

  if (existingIndex > -1) {
    items[existingIndex].quantity += newItem.quantity;
  } else {
    items.push(newItem);
  }
  setCartItems(items);
  return items;
};

export const clearCart = () => {
  try {
    localStorage.removeItem("products");
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
};
