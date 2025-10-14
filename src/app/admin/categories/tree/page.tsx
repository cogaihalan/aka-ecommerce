import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoryTreeView } from "@/features/categories/components/category-tree";
import { adminCategoryService } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ArrowLeft, Plus, TreePine } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

// Force dynamic rendering to avoid build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard: Category Tree",
  description: "Hierarchical view of product categories",
};

export default async function Page() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/categories"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "text-xs md:text-sm"
              )}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Link>
            <Heading
              title="Category Tree"
              description="Hierarchical view of product categories"
            />
          </div>
          <Link
            href="/admin/categories/new"
            className={cn(buttonVariants(), "text-xs md:text-sm")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Link>
        </div>
        <Separator />
        <Suspense
          fallback={
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TreePine className="mr-2 h-5 w-5" />
                  Category Tree
                </CardTitle>
                <CardDescription>Loading category hierarchy...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 bg-muted animate-pulse rounded"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          }
        >
          <CategoryTreePage />
        </Suspense>
      </div>
    </PageContainer>
  );
}

async function CategoryTreePage() {
  try {
    const { categories } = await adminCategoryService.getCategoryTree();

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TreePine className="mr-2 h-5 w-5" />
            Category Tree
          </CardTitle>
          <CardDescription>
            Hierarchical view of all product categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryTreeView
            categories={categories}
            showActions={true}
            showProductCount={true}
          />
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Error fetching category tree:", error);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TreePine className="mr-2 h-5 w-5" />
            Category Tree
          </CardTitle>
          <CardDescription>
            Hierarchical view of all product categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Unable to load category tree. Please check your authentication and
              try again.
            </p>
            <p className="text-sm text-muted-foreground">
              Error: {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
}
