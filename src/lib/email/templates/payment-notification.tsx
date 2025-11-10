import React from "react";
import type { Order, PaymentStatus } from "@/types";

interface PaymentNotificationEmailProps {
  order: Order;
  customerName: string;
  customerEmail: string;
  paymentStatus: PaymentStatus;
  note?: string;
}

export const PaymentNotificationEmail: React.FC<PaymentNotificationEmailProps> = ({
  order,
  customerName,
  customerEmail,
  paymentStatus,
  note,
}) => {
  const getPaymentStatusText = (status: PaymentStatus): string => {
    const statusMap: Record<PaymentStatus, string> = {
      UNPAID: "Chưa thanh toán",
      PAID: "Đã thanh toán",
      FAILED: "Thanh toán thất bại",
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusColor = (status: PaymentStatus): string => {
    const colorMap: Record<PaymentStatus, string> = {
      UNPAID: "#f59e0b",
      PAID: "#10b981",
      FAILED: "#ef4444",
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
        <title>Thông báo thanh toán đơn hàng #{order.code}</title>
      </head>
      <body style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
          <h1 style={{ color: "#2563eb", marginTop: "0" }}>Thông báo thanh toán</h1>
          <p>Xin chào <strong>{customerName}</strong>,</p>
          <p>Chúng tôi xin thông báo về tình trạng thanh toán đơn hàng của bạn:</p>
        </div>

        <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ 
              display: "inline-block", 
              padding: "12px 24px", 
              borderRadius: "8px", 
              backgroundColor: getPaymentStatusColor(paymentStatus),
              color: "#fff",
              fontSize: "18px",
              fontWeight: "bold"
            }}>
              {getPaymentStatusText(paymentStatus)}
            </div>
          </div>

          <div style={{ backgroundColor: "#f9fafb", padding: "15px", borderRadius: "6px", marginBottom: "20px" }}>
            <p style={{ margin: "5px 0" }}><strong>Mã đơn hàng:</strong> #{order.code}</p>
            <p style={{ margin: "5px 0" }}><strong>Số tiền:</strong> {formatCurrency(order.finalAmount)}</p>
            <p style={{ margin: "5px 0" }}><strong>Phương thức thanh toán:</strong> {
              order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" :
              order.paymentMethod === "VNPAY" ? "VNPay" :
              order.paymentMethod === "MOMO" ? "MoMo" :
              order.paymentMethod === "ZALO" ? "ZaloPay" : order.paymentMethod
            }</p>
          </div>

          {note && (
            <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "6px", padding: "15px", marginBottom: "20px" }}>
              <p style={{ margin: "0", color: "#1e40af" }}><strong>Ghi chú:</strong> {note}</p>
            </div>
          )}

          {paymentStatus === "PAID" && (
            <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px", padding: "15px", marginTop: "20px" }}>
              <p style={{ margin: "0", color: "#166534" }}>
                <strong>✓ Thanh toán thành công!</strong> Cảm ơn bạn đã thanh toán. 
                Đơn hàng của bạn sẽ được xử lý và giao hàng sớm nhất có thể.
              </p>
            </div>
          )}

          {paymentStatus === "FAILED" && (
            <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", padding: "15px", marginTop: "20px" }}>
              <p style={{ margin: "0", color: "#991b1b" }}>
                <strong>⚠ Thanh toán thất bại:</strong> Giao dịch thanh toán của bạn không thành công. 
                Vui lòng kiểm tra lại thông tin thanh toán hoặc thử lại sau. 
                Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ với chúng tôi để được hỗ trợ.
              </p>
            </div>
          )}

          {paymentStatus === "UNPAID" && order.paymentMethod !== "COD" && (
            <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: "6px", padding: "15px", marginTop: "20px" }}>
              <p style={{ margin: "0", color: "#92400e" }}>
                <strong>Lưu ý:</strong> Đơn hàng của bạn chưa được thanh toán. 
                Vui lòng hoàn tất thanh toán để chúng tôi có thể xử lý đơn hàng.
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

