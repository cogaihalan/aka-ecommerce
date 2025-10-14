import KBar from "@/components/kbar";
import AppSidebar from "@/components/layout/app-sidebar";
import Header from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "AKA Ecom Admin Dashboard",
  description: "AKA Ecom Admin Dashboard with Next.js and Shadcn",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  let defaultOpen = false;

  // Only read cookies in non-static contexts
  if (
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PHASE !== "phase-production-build"
  ) {
    try {
      const cookieStore = await cookies();
      defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
    } catch (error) {
      console.warn("Failed to read sidebar cookie:", error);
    }
  }
  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
