"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnalyticsStatCard } from "@/features/analytics/components/analytics-stat-card";
import {
  Users,
  Eye,
  Clock,
  TrendingDown,
  MousePointerClick,
  UserPlus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { OverviewData, PageData, VisitorData, ReferrerData } from "@/types/analytics";

// Lazy load heavy chart component (recharts is ~50-70kb)
const VisitorsChart = dynamic(
  () => import("@/features/analytics/components/visitors-chart").then((mod) => ({ default: mod.VisitorsChart })),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle>Visitors Over Time</CardTitle>
          <CardDescription>
            Track active users, new users, and sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    ),
  }
);

// Lazy load table components
const TopPagesTable = dynamic(
  () => import("@/features/analytics/components/top-pages-table").then((mod) => ({ default: mod.TopPagesTable })),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
          <CardDescription>Most viewed pages on your site</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    ),
  }
);

const TopReferrersTable = dynamic(
  () => import("@/features/analytics/components/top-referrers-table").then((mod) => ({ default: mod.TopReferrersTable })),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle>Top Referrers</CardTitle>
          <CardDescription>Where your visitors are coming from</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    ),
  }
);

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("30daysAgo");
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [pages, setPages] = useState<PageData[]>([]);
  const [referrers, setReferrers] = useState<ReferrerData[]>([]);

  const dateRangeOptions = [
    { value: "7daysAgo", label: "7 ngày qua" },
    { value: "30daysAgo", label: "30 ngày qua" },
    { value: "90daysAgo", label: "90 ngày qua" },
  ];

  const getDateRange = (range: string) => {
    return { startDate: range, endDate: "today" };
  };

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { startDate, endDate } = getDateRange(dateRange);
      const params = new URLSearchParams({ startDate, endDate });

      // Fetch all data in parallel
      const [overviewRes, visitorsRes, pagesRes, referrersRes] =
        await Promise.all([
          fetch(`/api/analytics/overview?${params}`),
          fetch(`/api/analytics/visitors?${params}`),
          fetch(`/api/analytics/pages?${params}&limit=10`),
          fetch(`/api/analytics/referrers?${params}&limit=10`),
        ]);

      if (
        !overviewRes.ok ||
        !visitorsRes.ok ||
        !pagesRes.ok ||
        !referrersRes.ok
      ) {
        throw new Error("Lỗi khi tải dữ liệu phân tích");
      }

      const [overviewData, visitorsData, pagesData, referrersData] =
        await Promise.all([
          overviewRes.json(),
          visitorsRes.json(),
          pagesRes.json(),
          referrersRes.json(),
        ]);

      if (overviewData.success) {
        setOverview(overviewData.data);
      }
      if (visitorsData.success) {
        setVisitors(visitorsData.data);
      }
      if (pagesData.success) {
        setPages(pagesData.data);
      }
      if (referrersData.success) {
        setReferrers(referrersData.data);
      }
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải dữ liệu phân tích");
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const formatDuration = (seconds: string) => {
    const secs = parseFloat(seconds);
    if (secs < 60) {
      return `${Math.round(secs)}s`;
    }
    const minutes = Math.floor(secs / 60);
    const remainingSecs = Math.round(secs % 60);
    return `${minutes}m ${remainingSecs}s`;
  };

  const formatBounceRate = (rate: string) => {
    return `${(parseFloat(rate) * 100).toFixed(1)}%`;
  };

  if (loading && !overview) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Báo cáo phân tích</h1>
            <p className="text-muted-foreground">
              Xem và phân tích lượt truy cập trang web của bạn
            </p>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Báo cáo phân tích</h1>
            <p className="text-muted-foreground">
              Xem và phân tích lượt truy cập trang web của bạn
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lỗi</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchAnalyticsData}>Thử lại</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Báo cáo phân tích</h1>
          <p className="text-muted-foreground">
            Xem và phân tích lượt truy cập trang web của bạn
          </p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn khoảng thời gian" />
          </SelectTrigger>
          <SelectContent>
            {dateRangeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnalyticsStatCard
            title="Người dùng hoạt động"
            value={parseInt(overview.activeUsers)}
            icon={Users}
            description="Người dùng đã tương tác với trang web của bạn"
          />
          <AnalyticsStatCard
            title="Lượt xem trang"
            value={parseInt(overview.pageViews)}
            icon={Eye}
            description="Tổng số trang đã xem"
          />
          <AnalyticsStatCard
            title="Số lượt truy cập"
            value={parseInt(overview.sessions)}
            icon={MousePointerClick}
            description="Số lượt truy cập của từng người dùng"
          />
          <AnalyticsStatCard
            title="Người dùng mới"
            value={parseInt(overview.newUsers)}
            icon={UserPlus}
            description="Người dùng đã truy cập trang web của bạn lần đầu"
          />
          <AnalyticsStatCard
            title="Thời gian trung bình của lượt truy cập"
            value={formatDuration(overview.avgSessionDuration)}
            icon={Clock}
            description="Thời gian trung bình của từng lượt truy cập"
          />
          <AnalyticsStatCard
            title="Tỷ lệ rời khỏi trang"
            value={formatBounceRate(overview.bounceRate)}
            icon={TrendingDown}
            description="Tỷ lệ rời khỏi trang của từng lượt truy cập"
          />
        </div>
      )}

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visitors.length > 0 && <VisitorsChart data={visitors} />}
        {pages.length > 0 && <TopPagesTable pages={pages} />}
      </div>

      {referrers.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          <TopReferrersTable referrers={referrers} />
        </div>
      )}
    </div>
  );
}
