import { Metadata } from "next";
import ProfilePage from "@/features/storefront/components/account/profile/profile-page";

export const metadata: Metadata = {
  title: "Cài đặt hồ sơ - AKA Store",
  description: "Cập nhật thông tin và tùy chọn hồ sơ của bạn.",
};

export default function ProfilePageRoute() {
  return <ProfilePage />;
}
