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
  averageRating: number;
  reviewCount: number;
  discountPrice: number;
  status: ProductStatus;
  images: ProductImage[];
  variants: ProductVariant[];
  categories: ProductCategory[];
}

export type ProductReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ProductReview {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  id: number;
  product: {
    id: number;
    name: string;
  }
  rating: number;
  comment: string;
  status: ProductReviewStatus;
  user: {
    id: number;
    username: string;
    clerkId: string;
    fullName: string;
  };
}