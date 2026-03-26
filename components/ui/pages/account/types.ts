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
  billingInfo: BillingInfo;
  paymentInfo: PaymentInfo;
}
