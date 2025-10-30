import { Metadata } from "next";
import AccountLayout from "@/features/storefront/components/account/account-layout";

export const metadata: Metadata = {
  title: "Tài khoản của tôi - AKA Store",
  description: "Quản lý tài khoản, đơn hàng và tuỳ chọn.",
};

export default function AccountLayoutRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountLayout>{children}</AccountLayout>;
}
