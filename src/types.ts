export interface Product {
  id: number;
  name: string;
  price: number; // in KGS (сом)
  category: string;
  image: string;
  description: string;
  features: string[];
  rating: number;
  inStock: boolean;
  whatsappNumber?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
