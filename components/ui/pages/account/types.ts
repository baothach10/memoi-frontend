export interface OrderItem {
  id: string;
  name: string;
  color_name: string;
  size?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  order_number: string;
  date: string;
  shipTo: string;
  status: "IN_PROGRESS" | "COMPLETED";
  deliveryDetail: string;
  items: OrderItem[];
  total: number;
  currency: string;
}

export interface RawOrderItem {
  quantity: number;
  product: {
    image_url: string;
    name: string;
    price: number;
    currency: string;
    color_name: string;
    size: string;
  };
}

export interface RawOrder {
  id: string;
  status: "IN_PROGRESS" | "COMPLETED";
  order_number: string;
  created_at: string;
  destination: string;
  total_amount: number;
  items: RawOrderItem[];
}

export interface RawBillingInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  optional_address?: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
}

export interface RawOrderDetails extends RawOrder {
  tier_discount_amount: number;
  birth_month_discount_amount: number;
  welcome_discount_amount: number;
  promo_discount_amount: number;
  shipping_fee: number;
  total_taxed: number;
  billing_info: RawBillingInfo;
}

export interface ProgressStep {
  label: string;
  date: string;
  completed: boolean;
  active?: boolean;
}

export interface BillingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export interface PaymentInfo {
  subtotal: number;
  shipping: string;
  discount: number;
}

export interface OrderDetails extends Order {
  progress: ProgressStep[];
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  birth_month_discount: number;
  tier_discount_amount: number;
  welcome_discount_amount:number;
  promo_discount_amount: number;
  shipping_fee: number;
}
