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
import { Badge } from "@/components/ui/badge";
import { adminCategoryService } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ArrowLeft, Edit, Package, TreePine } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

// Force dynamic rendering to avoid build-time API calls
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard: Category Details",
  description: "View category details and manage products",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const categoryId = parseInt(params.id);

  try {
    const category = await adminCategoryService.getCategory(categoryId);
    const { products, totalProducts } =
      await adminCategoryService.getCategoryWithProducts(categoryId);

    return (
      <PageContainer scrollable>
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/categories"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "text-xs md:text-sm"
                )}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
              </Link>
              <Heading
                title={category.name}
                description="Category details and management"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href={`/admin/categories/${categoryId}/products`}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "text-xs md:text-sm"
                )}
              >
                <Package className="mr-2 h-4 w-4" />
                Manage Products
              </Link>
              <Link
                href={`/admin/categories/${categoryId}/edit`}
                className={cn(buttonVariants(), "text-xs md:text-sm")}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Category
              </Link>
            </div>
          </div>

          <Separator />

          {/* Category Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Information</CardTitle>
                  <CardDescription>
                    Basic information about this category
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Name
                      </label>
                      <p className="text-sm">{category.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Slug
                      </label>
                      <p className="text-sm font-mono">{category.slug}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Level
                      </label>
                      <p className="text-sm">{category.level}</p>
                    </div>
                  </div>

                  {category.description && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Description
                      </label>
                      <p className="text-sm mt-1">{category.description}</p>
                    </div>
                  )}

                  {category.image && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Image
                      </label>
                      <div className="mt-2">
                        <Image
                          src={category.image.url}
                          alt={category.image.alt || category.name}
                          width={200}
                          height={200}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* SEO Information */}
              {category.seo &&
                (category.seo.title || category.seo.description) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>SEO Information</CardTitle>
                      <CardDescription>
                        Search engine optimization settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {category.seo.title && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Meta Title
                          </label>
                          <p className="text-sm mt-1">{category.seo.title}</p>
                        </div>
                      )}
                      {category.seo.description && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Meta Description
                          </label>
                          <p className="text-sm mt-1">
                            {category.seo.description}
                          </p>
                        </div>
                      )}
                      {category.seo.keywords &&
                        category.seo.keywords.length > 0 && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Keywords
                            </label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {category.seo.keywords.map((keyword, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active</span>
                    <Badge
                      variant={category.isActive ? "default" : "secondary"}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Include in Menu</span>
                    <Badge
                      variant={category.includeInMenu ? "outline" : "secondary"}
                    >
                      {category.includeInMenu ? "Included" : "Hidden"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Products</span>
                    <Badge variant="secondary" className="font-mono">
                      {totalProducts}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Created</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Updated</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(category.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Hierarchy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TreePine className="mr-2 h-4 w-4" />
                    Hierarchy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <div className="font-medium">Path</div>
                    <p className="text-muted-foreground font-mono">
                      {category.path}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  } catch (error) {
    notFound();
  }
}
