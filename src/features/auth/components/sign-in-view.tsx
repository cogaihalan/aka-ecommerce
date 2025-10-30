import { SignIn as ClerkSignInForm } from "@clerk/nextjs";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function SignInViewPage() {
  return (
    <div className="flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập</h1>
          <p className="text-muted-foreground">Nhập thông tin để truy cập tài khoản</p>
        </div>

        <ClerkSignInForm />

        <p className="text-muted-foreground text-center text-sm">
          Khi tiếp tục, bạn đồng ý với{" "}
          <Link
            href="/terms"
            className="hover:text-primary underline underline-offset-4"
          >
            Điều khoản dịch vụ
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="hover:text-primary underline underline-offset-4"
          >
            Chính sách bảo mật
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
