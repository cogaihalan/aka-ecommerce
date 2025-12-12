import React from "react";
import type { AffiliateApproval, AffiliateApprovalStatus } from "@/types/affiliate";

interface AffiliateApprovalEmailProps {
  approval: AffiliateApproval;
  customerName: string;
  customerEmail: string;
  status: AffiliateApprovalStatus;
  note?: string;
}

export const AffiliateApprovalEmail: React.FC<AffiliateApprovalEmailProps> = ({
  approval,
  customerName,
  customerEmail,
  status,
  note,
}) => {
  const isApproved = status === "APPROVED";
  const isRejected = status === "REJECTED";

  const getStatusText = (status: AffiliateApprovalStatus): string => {
    const statusMap: Record<AffiliateApprovalStatus, string> = {
      PENDING: "Chờ duyệt",
      APPROVED: "Đã duyệt",
      REJECTED: "Từ chối",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: AffiliateApprovalStatus): string => {
    const colorMap: Record<AffiliateApprovalStatus, string> = {
      PENDING: "#6b7280",
      APPROVED: "#10b981",
      REJECTED: "#ef4444",
    };
    return colorMap[status] || "#6b7280";
  };

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          {isApproved ? "Yêu cầu affiliate đã được duyệt" : "Yêu cầu affiliate đã bị từ chối"}
        </title>
      </head>
      <body style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333", maxWidth: "600px", margin: "0 auto", padding: "20px", backgroundColor: "#f5f5f5" }}>
        <div style={{ backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          {/* Header */}
          <div style={{ 
            background: isApproved 
              ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" 
              : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", 
            padding: "40px 20px", 
            textAlign: "center",
            color: "#fff"
          }}>
            <h1 style={{ margin: "0 0 10px 0", fontSize: "28px", fontWeight: "bold" }}>
              {isApproved ? "✅ Yêu cầu đã được duyệt" : "❌ Yêu cầu đã bị từ chối"}
            </h1>
            <p style={{ margin: "0", fontSize: "16px", opacity: 0.95 }}>
              {isApproved ? "Chúc mừng! Bạn đã trở thành affiliate của chúng tôi" : "Thông báo về yêu cầu affiliate"}
            </p>
          </div>

          {/* Content */}
          <div style={{ padding: "30px 20px", backgroundColor: "#fff" }}>
            <p style={{ margin: "0 0 20px 0", fontSize: "16px" }}>
              Xin chào <strong>{customerName}</strong>,
            </p>

            <p style={{ margin: "0 0 20px 0", fontSize: "16px", color: "#4b5563" }}>
              {isApproved 
                ? "Chúng tôi rất vui mừng thông báo rằng yêu cầu tham gia chương trình affiliate của bạn đã được duyệt."
                : "Chúng tôi rất tiếc phải thông báo rằng yêu cầu tham gia chương trình affiliate của bạn đã bị từ chối."}
            </p>

            {/* Status Badge */}
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <div style={{ 
                display: "inline-block", 
                padding: "12px 24px", 
                borderRadius: "8px", 
                backgroundColor: getStatusColor(status),
                color: "#fff",
                fontSize: "18px",
                fontWeight: "bold"
              }}>
                {getStatusText(status)}
              </div>
            </div>

            {/* Approval Details */}
            <div style={{ backgroundColor: "#f9fafb", padding: "15px", borderRadius: "6px", marginBottom: "20px" }}>
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                <strong>Mã yêu cầu:</strong> #{approval.id}
              </p>
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                <strong>Email:</strong> {customerEmail}
              </p>
              {approval.reason && (
                <p style={{ margin: "5px 0", fontSize: "14px" }}>
                  <strong>Lý do đăng ký:</strong> {approval.reason}
                </p>
              )}
            </div>

            {/* Approved Content */}
            {isApproved && (
              <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px", padding: "20px", marginBottom: "20px" }}>
                <h3 style={{ margin: "0 0 15px 0", color: "#166534", fontSize: "18px" }}>
                  🎉 Bước tiếp theo
                </h3>
                <ul style={{ margin: "0", paddingLeft: "20px", color: "#166534", lineHeight: "1.8" }}>
                  <li>Bạn có thể bắt đầu tạo affiliate links ngay bây giờ</li>
                  <li>Theo dõi hoa hồng và giao dịch trong tài khoản affiliate của bạn</li>
                  <li>Rút tiền khi đạt ngưỡng tối thiểu</li>
                  <li>Nhận hỗ trợ từ đội ngũ của chúng tôi bất cứ lúc nào</li>
                </ul>
              </div>
            )}

            {/* Rejected Content */}
            {isRejected && (
              <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", padding: "20px", marginBottom: "20px" }}>
                <h3 style={{ margin: "0 0 15px 0", color: "#991b1b", fontSize: "18px" }}>
                  Thông tin thêm
                </h3>
                <p style={{ margin: "0 0 15px 0", color: "#991b1b", lineHeight: "1.8" }}>
                  Yêu cầu của bạn không đáp ứng các tiêu chí hiện tại của chương trình affiliate. 
                  Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
                </p>
                {note && (
                  <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "6px", marginTop: "15px" }}>
                    <p style={{ margin: "0", color: "#991b1b" }}>
                      <strong>Ghi chú:</strong> {note}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Note */}
            {note && isApproved && (
              <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "6px", padding: "15px", marginBottom: "20px" }}>
                <p style={{ margin: "0", color: "#1e40af" }}>
                  <strong>Ghi chú:</strong> {note}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ 
            marginTop: "0", 
            padding: "20px", 
            borderTop: "1px solid #e5e7eb", 
            textAlign: "center", 
            color: "#6b7280", 
            fontSize: "14px",
            backgroundColor: "#f9fafb"
          }}>
            <p style={{ margin: "0 0 10px 0" }}>
              Trân trọng,<br /><strong style={{ color: "#111827" }}>AKA Ecommerce</strong>
            </p>
            <p style={{ margin: "10px 0 0 0", fontSize: "12px" }}>
              Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hỗ trợ.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};
