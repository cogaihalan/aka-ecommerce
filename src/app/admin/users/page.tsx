import { Metadata } from "next";
import { Suspense } from "react";
import { AddUserDialog } from "@/features/users/components/add-user-dialog";
import UserListingPage from "@/features/users/components/user-listing";
import PageContainer from "@/components/layout/page-container";
import { searchParamsCache } from "@/lib/searchparams";
import { DashboardPageProps } from "@/types";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";

export const metadata: Metadata = {
  title: "User Management | AKA Store Dashboard",
  description: "Manage user accounts, roles, and permissions",
};

export default async function UsersPage(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Users"
            description="Manage user accounts, roles, and permissions for your store."
          />
          <AddUserDialog />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <UserListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
