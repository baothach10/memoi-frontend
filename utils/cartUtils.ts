export interface CartItem {
  productId: number;
  productName: string;
  productImage: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

export const COLOR_NAME_MAP: Record<string, string> = {
  "#FFFFFF": "WHITE",
  "#ffffff": "WHITE",
  "#000000": "BLACK",
  "#FF0000": "RED",
  "#ff0000": "RED",
  "#A52A2A": "BROWN",
  "#a52a2a": "BROWN",
  "#808080": "GREY",
  "#C0C0C0": "SILVER",
  "#FFC0CB": "PINK",
  "#ffc0cb": "PINK",
  "#0000FF": "BLUE",
  "#0000ff": "BLUE",
  "#008000": "GREEN",
  "#FFFF00": "YELLOW",
  "#ffff00": "YELLOW",
  "#FFA500": "ORANGE",
  "#ffa500": "ORANGE",
  "#800080": "PURPLE",
  "#F5F5DC": "BEIGE",
  "#f5f5dc": "BEIGE",
  "#000080": "NAVY",
  "#800000": "MAROON",
};

export const getColorName = (hex: string): string => {
  return COLOR_NAME_MAP[hex] || hex.toUpperCase();
};

export const getCartItems = (): CartItem[] => {
  try {
    const itemList = localStorage.getItem("itemList");
    if (itemList) {
      const parsedItems = JSON.parse(itemList);
      if (Array.isArray(parsedItems)) {
        return parsedItems;
      }
    }
  } catch (error) {
    console.error("Error reading cart items:", error);
  }
  return [];
};
