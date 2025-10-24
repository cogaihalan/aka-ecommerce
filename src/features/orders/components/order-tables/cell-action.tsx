"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MoreHorizontal,
  Eye,
  Package,
  Truck,
  X,
  RefreshCw,
} from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { unifiedOrderService } from "@/lib/api/services/unified";

interface CellActionProps {
  data: Order;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Status validation logic
  const canConfirmOrder = data.status === "PENDING";
  const canMarkAsShipping = data.status === "CONFIRMED";
  const canMarkAsDelivered = data.status === "SHIPPING";
  const canRefundOrder = data.status === "DELIVERED";
  const canCancelOrder = ["PENDING", "CONFIRMED", "SHIPPING"].includes(data.status);

  // Get status transition messages
  const getStatusMessage = (action: string) => {
    switch (action) {
      case "confirm":
        return canConfirmOrder 
          ? "Confirm this order" 
          : "Order must be PENDING to confirm";
      case "shipping":
        return canMarkAsShipping 
          ? "Mark order as shipping" 
          : "Order must be CONFIRMED to mark as shipping";
      case "delivered":
        return canMarkAsDelivered 
          ? "Mark order as delivered" 
          : "Order must be SHIPPING to mark as delivered";
      case "refund":
        return canRefundOrder 
          ? "Refund this order" 
          : "Order must be DELIVERED to refund";
      case "cancel":
        return canCancelOrder 
          ? "Cancel this order" 
          : "Order cannot be cancelled in current status";
      default:
        return "";
    }
  };

  const handleConfirmOrder = async () => {
    try {
      setLoading(true);
      await unifiedOrderService.confirmOrder(data.id, "Order confirmed by admin");
      toast.success("Order confirmed successfully");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Failed to confirm order");
    } finally {
      setLoading(false);
    }
  };

  const handleShippingUpdate = async () => {
    try {
      setLoading(true);
      await unifiedOrderService.updateOrderShippingStatus(data.id, "Order shipped by admin");
      toast.success("Order status updated to shipping");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update order to shipping");
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveredUpdate = async () => {
    try {
      setLoading(true);
      await unifiedOrderService.markDeliveredOrder(data.id, "Order delivered by admin");
      toast.success("Order marked as delivered");
      router.refresh();
    } catch (error) {
      toast.error("Failed to mark order as delivered");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setLoading(true);
      await unifiedOrderService.cancelOrder(data.id, "Cancelled by admin");
      toast.success("Order cancelled successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to cancel order");
    } finally {
      setLoading(false);
    }
  };

  const handleRefundOrder = async () => {
    try {
      setLoading(true);
      await unifiedOrderService.refundOrder(data.id, "Refunded by admin");
      toast.success("Order refunded successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to refund order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/orders/${data.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Status Updates</DropdownMenuLabel>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem
                onClick={handleConfirmOrder}
                disabled={loading || !canConfirmOrder}
                className={!canConfirmOrder ? "opacity-50 cursor-not-allowed" : ""}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Confirm Order
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getStatusMessage("confirm")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem
                onClick={handleShippingUpdate}
                disabled={loading || !canMarkAsShipping}
                className={!canMarkAsShipping ? "opacity-50 cursor-not-allowed" : ""}
              >
                <Truck className="mr-2 h-4 w-4" /> Mark as Shipping
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getStatusMessage("shipping")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem
                onClick={handleDeliveredUpdate}
                disabled={loading || !canMarkAsDelivered}
                className={!canMarkAsDelivered ? "opacity-50 cursor-not-allowed" : ""}
              >
                <Package className="mr-2 h-4 w-4" /> Mark as Delivered
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getStatusMessage("delivered")}</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Payment & Refunds</DropdownMenuLabel>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem
                onClick={handleRefundOrder}
                disabled={loading || !canRefundOrder}
                className={!canRefundOrder ? "opacity-50 cursor-not-allowed" : ""}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Refund Order
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getStatusMessage("refund")}</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenuSeparator />

          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem
                onClick={handleCancelOrder}
                disabled={loading || !canCancelOrder}
                className={`text-destructive ${!canCancelOrder ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <X className="mr-2 h-4 w-4 text-destructive" /> Cancel Order
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getStatusMessage("cancel")}</p>
            </TooltipContent>
          </Tooltip>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
};
