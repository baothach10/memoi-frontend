export interface OrderItem {
  id: string;
  name: string;
  color: string;
  size?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  shipTo: string;
  status: string;
  deliveryDetail: string;
  items: OrderItem[];
  total: number;
  currency: string;
}
