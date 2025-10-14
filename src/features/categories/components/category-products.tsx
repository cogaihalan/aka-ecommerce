"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import type {
  CategoryWithProducts,
} from "@/lib/api/types";
import { Search, ArrowLeft, ExternalLink, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CategoryProductsProps {
  category: CategoryWithProducts;
  onBack?: () => void;
}

export function CategoryProducts({ category, onBack }: CategoryProductsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products based on search term
  const filteredProducts = category.products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground">
              Products in this category ({category.totalProducts} products)
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Products Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted">
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.shortDescription}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm">{product.sku}</code>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ${product.pricing?.basePrice?.toFixed(2) || '0.00'}
                      </div>
                      {product.pricing?.compareAtPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          ${product.pricing.compareAtPrice.toFixed(2)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.status === "active" ? "default" : "secondary"}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/product/${product.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">No products found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm
                  ? "No products match your search criteria."
                  : "This category doesn't have any products yet."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}