export interface ProductImage {
  id: number;
  url: string;
  primary: boolean;
}

export interface ProductVariant {
  id: number;
  name: string;
  stock: number;
  price: number;
  discountPrice: number;
  status: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
  parentId: number;
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
  stock: number;
  price: number;
  discountPrice: number;
  status: ProductStatus;
  images: ProductImage[];
  variants: ProductVariant[];
  categories: ProductCategory[];
}
