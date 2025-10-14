import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import FormCardSkeleton from "@/components/form-card-skeleton";
import { CategoryForm } from "@/features/categories/components/category-form";
import { adminCategoryService } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

// Force dynamic rendering to avoid build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard: New Category",
  description: "Create a new product category",
};

export default async function Page() {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <div className="flex flex-col items-start space-x-4">
          <Link
            href="/admin/categories"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-xs md:text-sm"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Link>
          <Heading
            title="New Category"
            description="Create a new product category"
          />
        </div>
        <Separator />
        <Suspense fallback={<FormCardSkeleton />}>
          <NewCategoryPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function NewCategoryPage() {
  // Get all categories for parent selection
  const result = await adminCategoryService.getCategories({
    limit: 1000,
  });
  const categories = Array.isArray(result) ? result : result.categories;

  return <CategoryForm categories={categories} />;
}
