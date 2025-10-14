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
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Force dynamic rendering to avoid build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard: Edit Category",
  description: "Edit product category",
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
        <div className="flex items-center space-x-4">
          <Link
            href={`/admin/categories/${categoryId}`}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-xs md:text-sm"
            )}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Category
          </Link>
          <Heading
            title="Edit Category"
            description="Update category information"
          />
        </div>
        <Separator />
        <Suspense fallback={<FormCardSkeleton />}>
          <EditCategoryPage categoryId={categoryId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function EditCategoryPage({ categoryId }: { categoryId: number }) {
  try {
    // Get the category and all categories for parent selection
    const [category, categoriesResponse] = await Promise.all([
      adminCategoryService.getCategory(categoryId),
      adminCategoryService.getCategories({ limit: 1000 }),
    ]);

    const categories = Array.isArray(categoriesResponse)
      ? categoriesResponse
      : categoriesResponse.categories;

    return (
      <CategoryForm
        category={category}
        categories={categories}
        onSuccess={() => {
          // This will be handled by the form component
        }}
      />
    );
  } catch (error) {
    notFound();
  }
}
