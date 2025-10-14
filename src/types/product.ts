export interface ProductImage {
  id: number;
  url: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: number;
  name: string;
  stock: number;
  price: number;
  discountPrice: number;
  status: string;
}

export type ProductStatus =
  | "DRAFT"
  | "ACTIVE"
  | "INACTIVE"
  | "ARCHIVED"
  | "OUT_OF_STOCK";

export interface Product {
  id: number;
  name: string;
  description: string;
  status: ProductStatus;
  images: ProductImage[];
  variants: ProductVariant[];
}
