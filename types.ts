
export type Category = 'All' | 'Mains' | 'Sides' | 'Drinks' | 'Desserts';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
}

export interface Coupon {
  code: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card';
  timestamp: number;
}
