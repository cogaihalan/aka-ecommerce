"use client";

import { Button } from "@/components/ui/button";

export default function Newsletter() {
  return (
    <section className="bg-muted/50 rounded-lg p-8 lg:p-16 text-center">
      <h2 className="text-3xl font-bold mb-4">Cập nhật tin tức</h2>
      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
        Đăng ký nhận bản tin để là người đầu tiên biết về sản phẩm mới, ưu đãi
        độc quyền và khuyến mãi đặc biệt.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Nhập email của bạn"
          className="flex-1 px-4 py-2 border rounded-md bg-background"
        />
        <Button>Đăng ký</Button>
      </div>
    </section>
  );
}
