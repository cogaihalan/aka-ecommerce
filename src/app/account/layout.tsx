import { Metadata } from "next";
import AccountLayout from "@/features/storefront/components/account/account-layout";

export const metadata: Metadata = {
  title: "My Account - AKA Store",
  description: "Manage your account, orders, and preferences.",
};

export default function AccountLayoutRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountLayout>{children}</AccountLayout>;
}
