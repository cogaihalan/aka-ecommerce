import React from "react";
import type { Order, OrderStatus } from "@/types";

interface OrderStatusUpdateEmailProps {
  order: Order;
  customerName: string;
  customerEmail: string;
  previousStatus: OrderStatus;
  newStatus: OrderStatus;
  note?: string;
}

export const OrderStatusUpdateEmail: React.FC<OrderStatusUpdateEmailProps> = ({
  order,
  customerName,
  customerEmail,
  previousStatus,
  newStatus,
  note,
}) => {
  const getStatusText = (status: OrderStatus): string => {
    const statusMap: Record<OrderStatus, string> = {
      PENDING: "Đang chờ xử lý",
      CONFIRMED: "Đã xác nhận",
      SHIPPING: "Đang giao hàng",
      DELIVERED: "Đã giao hàng",
      CANCELLED: "Đã hủy",
      REFUNDED: "Đã hoàn tiền",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: OrderStatus): string => {
    const colorMap: Record<OrderStatus, string> = {
      PENDING: "#6b7280",
      CONFIRMED: "#f59e0b",
      SHIPPING: "#3b82f6",
      DELIVERED: "#10b981",
      CANCELLED: "#ef4444",
      REFUNDED: "#8b5cf6",
    };
    return colorMap[status] || "#6b7280";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Cập nhật trạng thái đơn hàng #{order.code}</title>
      </head>
      <body style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
          <h1 style={{ color: "#2563eb", marginTop: "0" }}>Cập nhật trạng thái đơn hàng</h1>
          <p>Xin chào <strong>{customerName}</strong>,</p>
          <p>Đơn hàng của bạn đã được cập nhật trạng thái:</p>
        </div>

        <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ 
              display: "inline-block", 
              padding: "12px 24px", 
              borderRadius: "8px", 
              backgroundColor: getStatusColor(newStatus),
              color: "#fff",
              fontSize: "18px",
              fontWeight: "bold"
            }}>
              {getStatusText(newStatus)}
            </div>
          </div>

          <div style={{ backgroundColor: "#f9fafb", padding: "15px", borderRadius: "6px", marginBottom: "20px" }}>
            <p style={{ margin: "5px 0" }}><strong>Mã đơn hàng:</strong> #{order.code}</p>
            <p style={{ margin: "5px 0" }}><strong>Trạng thái cũ:</strong> {getStatusText(previousStatus)}</p>
            <p style={{ margin: "5px 0" }}><strong>Trạng thái mới:</strong> {getStatusText(newStatus)}</p>
            <p style={{ margin: "5px 0" }}><strong>Tổng giá trị:</strong> {formatCurrency(order.finalAmount)}</p>
          </div>

          {note && (
            <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "6px", padding: "15px", marginBottom: "20px" }}>
              <p style={{ margin: "0", color: "#1e40af" }}><strong>Ghi chú:</strong> {note}</p>
            </div>
          )}

          {newStatus === "CANCELLED" && (
            <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", padding: "15px", marginTop: "20px" }}>
              <p style={{ margin: "0", color: "#991b1b" }}>
                <strong>Thông báo:</strong> Đơn hàng của bạn đã bị hủy. Nếu bạn đã thanh toán, 
                chúng tôi sẽ hoàn tiền trong vòng 5-7 ngày làm việc.
              </p>
            </div>
          )}

          {newStatus === "REFUNDED" && (
            <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px", padding: "15px", marginTop: "20px" }}>
              <p style={{ margin: "0", color: "#166534" }}>
                <strong>Thông báo:</strong> Đơn hàng đã được hoàn tiền. Số tiền sẽ được chuyển về 
                tài khoản của bạn trong vòng 3-5 ngày làm việc.
              </p>
            </div>
          )}
        </div>

        <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #e5e7eb", textAlign: "center", color: "#6b7280", fontSize: "14px" }}>
          <p>Trân trọng,<br /><strong>AKA Ecommerce</strong></p>
        </div>
      </body>
    </html>
  );
};

