"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { prismicApiService } from "@/lib/api/prismic-service";

export function PrismicRefreshButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      // Use the Prismic service to refresh all data
      await prismicApiService.refreshAllData();

      // Add timestamp parameter to force refresh without using search params
      const params = new URLSearchParams(searchParams.toString());
      params.set("t", Date.now().toString());

      // Navigate to the updated URL
      router.push(`/admin/pages?${params.toString()}`);
    } catch (error) {
      console.error("Error refreshing data:", error);
      // Fallback: just add timestamp
      const params = new URLSearchParams(searchParams.toString());
      params.set("t", Date.now().toString());
      router.push(`/admin/pages?${params.toString()}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
      <RefreshCw
        className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
      />
      {isRefreshing ? "Refreshing..." : "Refresh"}
    </Button>
  );
}
