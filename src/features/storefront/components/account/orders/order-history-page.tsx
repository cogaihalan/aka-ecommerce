"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { columns } from "./order-history-columns";
import { unifiedOrderService } from "@/lib/api/services/unified";
import { Order } from "@/lib/api/types";
import { toast } from "sonner";

export default function OrderHistoryPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const result = await unifiedOrderService.getOrders({
          filters: {
            userId: user.id,
          },
          limit: 50, // Limit for better performance
        });

        setOrders(result.orders || []);
        setTotalOrders(result.pagination?.total || 0);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load order history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Order History</h1>
          <p className="text-muted-foreground">View and track your orders</p>
        </div>
        <DataTableSkeleton columnCount={6} rowCount={5} filterCount={2} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Order History</h1>
          <p className="text-muted-foreground">View and track your orders</p>
        </div>
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p>You haven't placed any orders yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground">
          View and track your orders ({totalOrders} total)
        </p>
      </div>

      <DataTableWrapper
        data={orders}
        totalItems={totalOrders}
        columns={columns}
        debounceMs={500}
        shallow={false}
      />
    </div>
  );
}
