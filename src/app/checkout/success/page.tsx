import { Metadata } from "next";
import { Suspense } from "react";
import CheckoutSuccessPage from "@/features/storefront/components/checkout/checkout-success-page";

export const metadata: Metadata = {
  title: "Order Confirmed - AKA Store",
  description: "Thank you for your purchase! Your order has been confirmed.",
};

export default function CheckoutSuccessPageRoute() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      }
    >
      <CheckoutSuccessPage />
    </Suspense>
  );
}
