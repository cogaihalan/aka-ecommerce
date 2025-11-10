import React from "react";

interface PromotionEmailProps {
  customerName: string;
  customerEmail: string;
  promotionTitle: string;
  promotionDescription: string;
  discountCode?: string;
  discountAmount?: number;
  discountPercentage?: number;
  validFrom?: string;
  validUntil?: string;
  termsAndConditions?: string;
  ctaLink?: string;
  ctaText?: string;
}

export const PromotionEmail: React.FC<PromotionEmailProps> = ({
  customerName,
  customerEmail,
  promotionTitle,
  promotionDescription,
  discountCode,
  discountAmount,
  discountPercentage,
  validFrom,
  validUntil,
  termsAndConditions,
  ctaLink,
  ctaText = "Mua ngay",
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
        <title>{promotionTitle}</title>
      </head>
      <body style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <div style={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
          padding: "30px 20px", 
          borderRadius: "8px", 
          marginBottom: "20px",
          textAlign: "center",
          color: "#fff"
        }}>
          <h1 style={{ margin: "0 0 10px 0", fontSize: "28px" }}>🎉 Khuyến mãi đặc biệt!</h1>
          <p style={{ margin: "0", fontSize: "18px", opacity: 0.95 }}>{promotionTitle}</p>
        </div>

        <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
          <p>Xin chào <strong>{customerName}</strong>,</p>
          <p>{promotionDescription}</p>

          {(discountCode || discountAmount || discountPercentage) && (
            <div style={{ 
              backgroundColor: "#f0fdf4", 
              border: "2px dashed #10b981", 
              borderRadius: "8px", 
              padding: "20px", 
              margin: "20px 0",
              textAlign: "center"
            }}>
              {discountCode && (
                <div style={{ marginBottom: "15px" }}>
                  <p style={{ margin: "0 0 8px 0", color: "#6b7280", fontSize: "14px" }}>Mã giảm giá:</p>
                  <div style={{ 
                    backgroundColor: "#fff", 
                    padding: "12px 20px", 
                    borderRadius: "6px",
                    display: "inline-block",
                    border: "2px solid #10b981"
                  }}>
                    <span style={{ 
                      fontFamily: "monospace", 
                      fontSize: "20px", 
                      fontWeight: "bold", 
                      color: "#10b981",
                      letterSpacing: "2px"
                    }}>
                      {discountCode}
                    </span>
                  </div>
                </div>
              )}

              {(discountAmount || discountPercentage) && (
                <div>
                  {discountPercentage && (
                    <p style={{ margin: "0", fontSize: "32px", fontWeight: "bold", color: "#10b981" }}>
                      Giảm {discountPercentage}%
                    </p>
                  )}
                  {discountAmount && (
                    <p style={{ margin: "10px 0 0 0", fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>
                      Giảm {formatCurrency(discountAmount)}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {(validFrom || validUntil) && (
            <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: "6px", padding: "15px", marginTop: "20px" }}>
              <p style={{ margin: "0", color: "#92400e" }}>
                <strong>⏰ Thời gian áp dụng:</strong>
                {validFrom && <span> Từ {validFrom}</span>}
                {validUntil && <span> đến {validUntil}</span>}
              </p>
            </div>
          )}

          {termsAndConditions && (
            <div style={{ backgroundColor: "#f9fafb", borderRadius: "6px", padding: "15px", marginTop: "20px" }}>
              <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#374151" }}>Điều kiện áp dụng:</p>
              <p style={{ margin: "0", color: "#6b7280", fontSize: "14px", whiteSpace: "pre-line" }}>
                {termsAndConditions}
              </p>
            </div>
          )}

          {ctaLink && (
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <a 
                href={ctaLink}
                style={{
                  display: "inline-block",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  padding: "14px 32px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "16px",
                  transition: "background-color 0.3s"
                }}
              >
                {ctaText}
              </a>
            </div>
          )}
        </div>

        <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #e5e7eb", textAlign: "center", color: "#6b7280", fontSize: "14px" }}>
          <p>Trân trọng,<br /><strong>AKA Ecommerce</strong></p>
          <p style={{ marginTop: "10px", fontSize: "12px" }}>
            Bạn nhận được email này vì bạn là khách hàng của chúng tôi. 
            Nếu không muốn nhận email khuyến mãi, bạn có thể <a href="#" style={{ color: "#2563eb" }}>hủy đăng ký</a>.
          </p>
        </div>
      </body>
    </html>
  );
};

