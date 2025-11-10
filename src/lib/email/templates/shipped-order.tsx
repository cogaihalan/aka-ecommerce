import React from "react";
import type { Order } from "@/types";

interface ShippedOrderEmailProps {
  order: Order;
  customerName: string;
  customerEmail: string;
  trackingNumber?: string;
  shippingCompany?: string;
  estimatedDeliveryDate?: string;
  note?: string;
}

export const ShippedOrderEmail: React.FC<ShippedOrderEmailProps> = ({
  order,
  customerName,
  customerEmail,
  trackingNumber,
  shippingCompany,
  estimatedDeliveryDate,
  note,
}) => {
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
        <title>Đơn hàng #{order.code} đã được gửi đi</title>
      </head>
      <body style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <div style={{ backgroundColor: "#eff6ff", padding: "20px", borderRadius: "8px", marginBottom: "20px", border: "2px solid #3b82f6" }}>
          <h1 style={{ color: "#1e40af", marginTop: "0", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "32px" }}>📦</span>
            <span>Đơn hàng đã được gửi đi!</span>
          </h1>
          <p>Xin chào <strong>{customerName}</strong>,</p>
          <p>Chúng tôi rất vui thông báo rằng đơn hàng của bạn đã được gửi đi và đang trên đường đến với bạn!</p>
        </div>

        <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
          <h2 style={{ color: "#1f2937", borderBottom: "2px solid #3b82f6", paddingBottom: "10px" }}>
            Thông tin đơn hàng #{order.code}
          </h2>

          <div style={{ backgroundColor: "#f9fafb", padding: "15px", borderRadius: "6px", marginTop: "20px" }}>
            <p style={{ margin: "5px 0" }}><strong>Mã đơn hàng:</strong> #{order.code}</p>
            {trackingNumber && (
              <p style={{ margin: "5px 0" }}>
                <strong>Mã vận đơn:</strong> 
                <span style={{ 
                  backgroundColor: "#dbeafe", 
                  padding: "4px 8px", 
                  borderRadius: "4px", 
                  marginLeft: "8px",
                  fontFamily: "monospace",
                  fontWeight: "bold"
                }}>
                  {trackingNumber}
                </span>
              </p>
            )}
            {shippingCompany && (
              <p style={{ margin: "5px 0" }}><strong>Đơn vị vận chuyển:</strong> {shippingCompany}</p>
            )}
            {estimatedDeliveryDate && (
              <p style={{ margin: "5px 0" }}>
                <strong>Dự kiến giao hàng:</strong> 
                <span style={{ color: "#10b981", fontWeight: "bold" }}> {estimatedDeliveryDate}</span>
              </p>
            )}
            <p style={{ margin: "5px 0" }}><strong>Tổng giá trị:</strong> {formatCurrency(order.finalAmount)}</p>
          </div>

          {note && (
            <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "6px", padding: "15px", marginTop: "20px" }}>
              <p style={{ margin: "0", color: "#1e40af" }}><strong>Ghi chú:</strong> {note}</p>
            </div>
          )}

          <div style={{ marginTop: "20px" }}>
            <h3 style={{ color: "#374151", fontSize: "16px", marginBottom: "10px" }}>Địa chỉ giao hàng:</h3>
            <div style={{ backgroundColor: "#f9fafb", padding: "15px", borderRadius: "6px" }}>
              <p style={{ margin: "5px 0" }}><strong>{order.recipientName}</strong></p>
              <p style={{ margin: "5px 0" }}>{order.recipientPhone}</p>
              <p style={{ margin: "5px 0" }}>{order.shippingAddress}</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
          <h3 style={{ color: "#166534", marginTop: "0" }}>📋 Những điều cần lưu ý:</h3>
          <ul style={{ margin: "10px 0", paddingLeft: "20px", color: "#166534" }}>
            <li>Vui lòng có mặt tại địa chỉ giao hàng trong thời gian dự kiến</li>
            <li>Kiểm tra kỹ hàng hóa trước khi ký nhận</li>
            <li>Giữ lại hóa đơn để đối chiếu nếu cần</li>
            {order.paymentMethod === "COD" && (
              <li>Chuẩn bị số tiền {formatCurrency(order.finalAmount)} để thanh toán khi nhận hàng</li>
            )}
          </ul>
        </div>

        {trackingNumber && (
          <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "20px", marginBottom: "20px", textAlign: "center" }}>
            <p style={{ margin: "0 0 15px 0", color: "#6b7280" }}>Bạn có thể theo dõi đơn hàng bằng mã vận đơn:</p>
            <div style={{ 
              backgroundColor: "#f3f4f6", 
              padding: "15px", 
              borderRadius: "6px",
              fontFamily: "monospace",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#1f2937"
            }}>
              {trackingNumber}
            </div>
          </div>
        )}

        <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #e5e7eb", textAlign: "center", color: "#6b7280", fontSize: "14px" }}>
          <p>Trân trọng,<br /><strong>AKA Ecommerce</strong></p>
          <p style={{ marginTop: "10px", fontSize: "12px" }}>
            Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline.
          </p>
        </div>
      </body>
    </html>
  );
};

