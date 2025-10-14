import { Metadata } from "next";
import AccountDashboard from "@/features/storefront/components/account/account-dashboard";

export const metadata: Metadata = {
  title: "Account Dashboard - AKA Store",
  description: "Your account overview and recent activity.",
};

export default function AccountPage() {
  return <AccountDashboard />;
}
