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
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  CreditCard,
  Truck,
  Download,
  Printer,
  X,
  RefreshCw,
} from "lucide-react";
import { Order } from "@/lib/api/types";
import { unifiedOrderService } from "@/lib/api/services/unified";
import { AlertModal } from "@/components/modal/alert-modal";

interface CellActionProps {
  data: Order;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await unifiedOrderService.deleteOrder(data.id);
      toast.success("Order deleted successfully.");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    try {
      setLoading(true);
      await unifiedOrderService.updateOrderStatus(data.id, status as any);
      toast.success(`Order status updated to ${status}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentStatusUpdate = async (status: string) => {
    try {
      setLoading(true);
      await unifiedOrderService.updatePaymentStatus(data.id, status as any);
      toast.success(`Payment status updated to ${status}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update payment status");
    } finally {
      setLoading(false);
    }
  };

  const handleFulfillmentStatusUpdate = async (status: string) => {
    try {
      setLoading(true);
      await unifiedOrderService.updateFulfillmentStatus(data.id, status as any);
      toast.success(`Fulfillment status updated to ${status}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update fulfillment status");
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
      await unifiedOrderService.refundOrder(
        data.id,
        undefined,
        "Refunded by admin"
      );
      toast.success("Order refunded successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to refund order");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintOrder = async () => {
    try {
      setLoading(true);
      const blob = await unifiedOrderService.printOrder(data.id, "pdf");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `order-${data.orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Order printed successfully");
    } catch (error) {
      toast.error("Failed to print order");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintShippingLabel = async () => {
    try {
      setLoading(true);
      const blob = await unifiedOrderService.printShippingLabel(data.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `shipping-label-${data.orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Shipping label printed successfully");
    } catch (error) {
      toast.error("Failed to print shipping label");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
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
          <DropdownMenuItem
            onClick={() => handleStatusUpdate("processing")}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Mark as Processing
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleStatusUpdate("shipped")}
            disabled={loading}
          >
            <Truck className="mr-2 h-4 w-4" /> Mark as Shipped
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleStatusUpdate("delivered")}
            disabled={loading}
          >
            <Package className="mr-2 h-4 w-4" /> Mark as Delivered
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Payment</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => handlePaymentStatusUpdate("paid")}
            disabled={loading}
          >
            <CreditCard className="mr-2 h-4 w-4" /> Mark as Paid
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleRefundOrder()}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refund Order
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Fulfillment</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => handleFulfillmentStatusUpdate("fulfilled")}
            disabled={loading}
          >
            <Package className="mr-2 h-4 w-4" /> Mark as Fulfilled
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleFulfillmentStatusUpdate("shipped")}
            disabled={loading}
          >
            <Truck className="mr-2 h-4 w-4" /> Mark as Shipped
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Print & Export</DropdownMenuLabel>
          <DropdownMenuItem onClick={handlePrintOrder} disabled={loading}>
            <Printer className="mr-2 h-4 w-4" /> Print Order
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handlePrintShippingLabel}
            disabled={loading}
          >
            <Download className="mr-2 h-4 w-4" /> Print Shipping Label
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => handleCancelOrder()}
            disabled={loading}
            className="text-destructive"
          >
            <X className="mr-2 h-4 w-4" /> Cancel Order
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            disabled={loading}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
