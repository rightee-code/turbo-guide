export type Category = "loaves" | "rolls" | "specialty";

export interface Product {
  id: string;
  name: string;
  description: string;
  /** Wholesale price per unit, in pounds. */
  price: number;
  /** What one unit is, e.g. "loaf" or "6-pack". */
  unit: string;
  /** Minimum units per order line. */
  minQty: number;
  emoji: string;
  category: Category;
  available: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Fulfillment = "delivery" | "pickup";

export interface OrderLine {
  productId: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  fulfillment: Fulfillment;
  address: string;
  deliveryDate: string;
  deliveryWindow: string;
  poNumber: string;
  notes: string;
  lines: OrderLine[];
  total: number;
  createdAt: string;
}
