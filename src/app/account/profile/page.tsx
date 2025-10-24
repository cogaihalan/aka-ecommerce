import { Metadata } from "next";
import ProfilePage from "@/features/storefront/components/account/profile/profile-page";

export const metadata: Metadata = {
  title: "Profile Settings - AKA Store",
  description: "Update your profile information and preferences.",
};

export default function ProfilePageRoute() {
  return <ProfilePage />;
}
