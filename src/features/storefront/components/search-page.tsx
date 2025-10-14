"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Search } from "lucide-react";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults] = useState([
    { id: 1, name: "Premium Product 1", price: 99.99, rating: 4.5, image: "" },
    { id: 2, name: "Premium Product 2", price: 149.99, rating: 4.8, image: "" },
    { id: 3, name: "Premium Product 3", price: 79.99, rating: 4.2, image: "" },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Search Products</h1>
        <p className="text-muted-foreground">
          Find exactly what you're looking for
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {searchQuery && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Showing results for "{searchQuery}"
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((product) => (
              <Card key={product.id} className="group cursor-pointer">
                <div className="aspect-square bg-muted rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">${product.price}</span>
                    <Button size="sm">Add to Cart</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!searchQuery && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Start searching</h3>
          <p className="text-muted-foreground">
            Enter a search term to find products
          </p>
        </div>
      )}
    </div>
  );
}
