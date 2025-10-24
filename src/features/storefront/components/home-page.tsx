"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Truck, Shield, RotateCcw } from "lucide-react";
import FullWidthBanner from "@/components/full-width-banner";

export default async function StorefrontHomePage() {
  return (
    <>
      {/* Hero Section - Full Width */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <FullWidthBanner />
      </div>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 lg:py-16">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Truck className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg">Free Shipping</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Free shipping on orders over 1,000,000 đ. Fast and reliable
              delivery to your doorstep.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg">Secure Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Your payment information is secure with our encrypted checkout
              process.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <RotateCcw className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg">Easy Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              30-day return policy. Not satisfied? Return it for a full refund.
            </CardDescription>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
