import { Metadata } from "next";
import ProductDetailPage from "@/features/storefront/components/product-detail-page";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;

  // Import the service here to avoid issues with client components
  const { serverUnifiedProductService } = await import(
    "@/lib/api/services/server"
  );

  try {
    const product = await serverUnifiedProductService.getProduct(
      parseInt(productId)
    );

    if (!product) {
      return {
        title: "Product Not Found - AKA Store",
        description: "The requested product could not be found.",
      };
    }

    return {
      title: `${product.name} - AKA Store`,
      description:
        product.description ||
        `Shop ${product.name} at AKA Store. Premium quality products with fast shipping.`,
      openGraph: {
        title: `${product.name} - AKA Store`,
        description:
          product.description || `Shop ${product.name} at AKA Store.`,
        images: product.images.length > 0 ? [product.images[0].url] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product - AKA Store",
      description: "Premium product details and specifications.",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  return <ProductDetailPage productId={productId} />;
}
