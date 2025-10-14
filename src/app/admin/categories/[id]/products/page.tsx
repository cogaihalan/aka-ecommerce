import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CategoryProducts } from "@/features/categories/components/category-products";
import { adminCategoryService } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Force dynamic rendering to avoid build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard: Category Products",
  description: "Manage products in category",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const categoryId = parseInt(params.id);

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<div>Loading...</div>}>
          <CategoryProductsPage categoryId={categoryId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function CategoryProductsPage({ categoryId }: { categoryId: number }) {
  try {
    const category =
      await adminCategoryService.getCategoryWithProducts(categoryId);

    return (
      <CategoryProducts
        category={category}
        onBack={() => {
          // This will be handled by the component
        }}
      />
    );
  } catch (error) {
    notFound();
  }
}
