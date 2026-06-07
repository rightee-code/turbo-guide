export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "loaves" | "rolls" | "specialty";
  available: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  email: string;
  phone: string;
  pickupDate: string;
  pickupTime: string;
  notes: string;
  total: number;
  createdAt: string;
}
