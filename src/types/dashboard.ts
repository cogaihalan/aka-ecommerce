import { SearchParams } from "nuqs/server";

export interface DashboardPageProps {
  searchParams: Promise<SearchParams>;
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
}
