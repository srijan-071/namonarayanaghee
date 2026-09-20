// Shared types for the entire application

export interface Review {
  author: string;
  rating: number;
  content: string;
  date: string;
  verified?: boolean;
}

export interface ProductVariant {
  id: number;
  title: string;
  price: number;
  salePrice: number;
  mrp: number | null;
  compareAtPrice: number | null;
  sku: string;
  gtin?: string;
  mpn?: string;
  available: boolean;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  weightGrams?: number;
}

export interface Product {
  id: number;
  slug: string;
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice: number | null;
  currency?: string;
  
  sku: string;
  gtin?: string;
  mpn?: string;

  images: string[];
  variants: ProductVariant[];
  type: string;
  vendor: string; // brand
  tags: string[];
  available: boolean;
  options: { name: string; values: string[] }[];
  
  packSize?: string;
  weightGrams?: number;

  rating?: {
    value: number;
    count: number;
  };
  reviews?: Review[];

  seo: {
    title: string;
    description: string;
  };
  updatedAt?: string;
}

export interface Collection {
  slug: string;
  title: string;
  description: string;
  image?: string;
  productSlugs: string[];
  seo: {
    title: string;
    description: string;
  };
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: string;
  image?: string;
  seo: {
    title: string;
    description: string;
  };
}

export interface StaticPage {
  slug: string;
  title: string;
  content: string;
  seo: {
    title: string;
    description: string;
  };
}

export interface CartItem {
  productId: number;
  variantId: number;
  slug: string;
  title: string;
  variantTitle: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export interface CheckoutInfo {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  payment: {
    method: string;
  };
}
