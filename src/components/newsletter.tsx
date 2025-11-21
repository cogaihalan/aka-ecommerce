"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Vui lòng nhập email của bạn");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/email/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerEmail: email,
          newsletterTitle: "Chào mừng bạn đến với bản tin của chúng tôi!",
          newsletterContent: `
            <p>Cảm ơn bạn đã đăng ký nhận bản tin từ AKA Ecommerce!</p>
            <p>Bạn sẽ là người đầu tiên nhận được thông tin về:</p>
            <ul style="margin: 15px 0; padding-left: 20px;">
              <li>Sản phẩm mới nhất</li>
              <li>Ưu đãi độc quyền</li>
              <li>Khuyến mãi đặc biệt</li>
              <li>Tin tức và cập nhật từ chúng tôi</li>
            </ul>
            <p>Hãy theo dõi email của bạn để không bỏ lỡ bất kỳ thông tin nào!</p>
          `,
          ctaLink: process.env.NEXT_PUBLIC_APP_URL || "/",
          ctaText: "Khám phá ngay",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Đăng ký thất bại");
      }

      toast.success("Đăng ký thành công!", {
        description: "Chúng tôi đã gửi email xác nhận đến bạn. Vui lòng kiểm tra hộp thư.",
      });
      setIsSubscribed(true);
      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("Đăng ký thất bại", {
        description: error instanceof Error ? error.message : "Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="bg-muted/50 rounded-lg p-8 lg:p-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 text-green-500">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12l2 2 4-4" />
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Cảm ơn bạn đã đăng ký!</h2>
          <p className="text-muted-foreground mb-6">
            Chúng tôi đã gửi email xác nhận đến bạn. Vui lòng kiểm tra hộp thư để xác nhận đăng ký.
          </p>
          <Button
            onClick={() => setIsSubscribed(false)}
            variant="outline"
          >
            Đăng ký email khác
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-muted/50 rounded-lg p-8 lg:p-16 text-center">
      <h2 className="text-3xl font-bold mb-4">Cập nhật tin tức</h2>
      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
        Đăng ký nhận bản tin để là người đầu tiên biết về sản phẩm mới, ưu đãi
        độc quyền và khuyến mãi đặc biệt.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border rounded-md bg-background disabled:opacity-50"
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : "Đăng ký"}
        </Button>
      </form>
    </section>
  );
}
