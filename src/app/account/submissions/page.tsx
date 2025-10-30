import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardPageProps } from "@/types";
import { searchParamsCache } from "@/lib/searchparams";
import MySubmissionsPage from "@/features/storefront/components/account/submissions/my-submissions";

export const metadata: Metadata = {
  title: "My Submissions - AKA Store",
  description: "View and manage your contest submissions.",
};

export default async function MySubmissionsRoute(props: DashboardPageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/auth/sign-in");
  }

  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams as any);

  return <MySubmissionsPage />;
}


