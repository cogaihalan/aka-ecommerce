import React from "react";

interface NewsletterEmailProps {
  customerName?: string;
  newsletterTitle: string;
  newsletterContent: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  ctaLink?: string;
  ctaText?: string;
  unsubscribeLink?: string;
}

export const NewsletterEmail: React.FC<NewsletterEmailProps> = ({
  customerName,
  newsletterTitle,
  newsletterContent,
  featuredImage,
  featuredImageAlt = "Newsletter Image",
  ctaLink,
  ctaText = "Xem thêm",
  unsubscribeLink,
}) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{newsletterTitle}</title>
      </head>
      <body style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333", maxWidth: "600px", margin: "0 auto", padding: "20px", backgroundColor: "#f5f5f5" }}>
        <div style={{ backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          {/* Header */}
          <div style={{ 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
            padding: "40px 20px", 
            textAlign: "center",
            color: "#fff"
          }}>
            <h1 style={{ margin: "0 0 10px 0", fontSize: "28px", fontWeight: "bold" }}>📰 Bản tin mới nhất</h1>
            <p style={{ margin: "0", fontSize: "16px", opacity: 0.95 }}>{newsletterTitle}</p>
          </div>

          {/* Featured Image */}
          {featuredImage && (
            <div style={{ width: "100%", marginBottom: "0" }}>
              <img 
                src={featuredImage} 
                alt={featuredImageAlt}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          )}

          {/* Content */}
          <div style={{ padding: "30px 20px", backgroundColor: "#fff" }}>
            {customerName ? (
              <p style={{ margin: "0 0 20px 0", fontSize: "16px" }}>
                Xin chào <strong>{customerName}</strong>,
              </p>
            ) : (
              <p style={{ margin: "0 0 20px 0", fontSize: "16px" }}>
                Xin chào,
              </p>
            )}

            <div 
              style={{ 
                fontSize: "16px", 
                color: "#4b5563",
                lineHeight: "1.8",
                whiteSpace: "pre-line"
              }}
              dangerouslySetInnerHTML={{ __html: newsletterContent }}
            />

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
            {unsubscribeLink && (
              <p style={{ margin: "10px 0 0 0", fontSize: "12px" }}>
                <a 
                  href={unsubscribeLink} 
                  style={{ color: "#2563eb", textDecoration: "none" }}
                >
                  Hủy đăng ký
                </a>
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
};

