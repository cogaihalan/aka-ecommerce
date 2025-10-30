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
          ? "Xác nhận đơn hàng này" 
          : "Đơn hàng phải ở trạng thái PENDING để xác nhận";
      case "shipping":
        return canMarkAsShipping 
          ? "Đánh dấu đơn hàng đang giao" 
          : "Đơn hàng phải ở trạng thái CONFIRMED để chuyển sang đang giao";
      case "delivered":
        return canMarkAsDelivered 
          ? "Đánh dấu đơn hàng đã giao" 
          : "Đơn hàng phải ở trạng thái SHIPPING để đánh dấu đã giao";
      case "refund":
        return canRefundOrder 
          ? "Hoàn tiền đơn hàng này" 
          : "Đơn hàng phải ở trạng thái DELIVERED để hoàn tiền";
      case "cancel":
        return canCancelOrder 
          ? "Hủy đơn hàng này" 
          : "Không thể hủy ở trạng thái hiện tại";
      default:
        return "";
    }
  };

  const handleConfirmOrder = async () => {
    try {
      setLoading(true);
      await unifiedOrderService.confirmOrder(data.id, "Xác nhận bởi quản trị viên");
      toast.success("Xác nhận đơn hàng thành công");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Xác nhận đơn hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleShippingUpdate = async () => {
    try {
      setLoading(true);
      await unifiedOrderService.updateOrderShippingStatus(data.id, "Đã giao cho đơn vị vận chuyển bởi quản trị viên");
      toast.success("Cập nhật trạng thái: Đang giao hàng");
      router.refresh();
    } catch (error) {
      toast.error("Cập nhật trạng thái giao hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveredUpdate = async () => {
    try {
      setLoading(true);
      await unifiedOrderService.markDeliveredOrder(data.id, "Đã giao bởi quản trị viên");
      toast.success("Đánh dấu đã giao thành công");
      router.refresh();
    } catch (error) {
      toast.error("Đánh dấu đã giao thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setLoading(true);
      await unifiedOrderService.cancelOrder(data.id, "Hủy bởi quản trị viên");
      toast.success("Hủy đơn hàng thành công");
      router.refresh();
    } catch (error) {
      toast.error("Hủy đơn hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleRefundOrder = async () => {
    try {
      setLoading(true);
      await unifiedOrderService.refundOrder(data.id, "Hoàn tiền bởi quản trị viên");
      toast.success("Hoàn tiền đơn hàng thành công");
      router.refresh();
    } catch (error) {
      toast.error("Hoàn tiền đơn hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/orders/${data.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Cập nhật trạng thái</DropdownMenuLabel>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem
                onClick={handleConfirmOrder}
                disabled={loading || !canConfirmOrder}
                className={!canConfirmOrder ? "opacity-50 cursor-not-allowed" : ""}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Xác nhận đơn hàng
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
                <Truck className="mr-2 h-4 w-4" /> Đang giao hàng
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
                <Package className="mr-2 h-4 w-4" /> Đã giao
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getStatusMessage("delivered")}</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Thanh toán & Hoàn tiền</DropdownMenuLabel>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem
                onClick={handleRefundOrder}
                disabled={loading || !canRefundOrder}
                className={!canRefundOrder ? "opacity-50 cursor-not-allowed" : ""}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Hoàn tiền
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
                <X className="mr-2 h-4 w-4 text-destructive" /> Hủy đơn hàng
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
