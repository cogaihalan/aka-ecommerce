import { Metadata } from "next";
import SignInViewPage from "@/features/auth/components/sign-in-view";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Trang đăng nhập.",
};

export default async function Page() {
  return <SignInViewPage />;
}
