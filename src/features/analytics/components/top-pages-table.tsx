"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface PageData {
  path: string;
  title: string;
  pageViews: number;
  activeUsers: number;
  avgSessionDuration: number;
  bounceRate: number;
}

interface TopPagesTableProps {
  pages: PageData[];
}

function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${minutes}m ${secs}s`;
}

function formatBounceRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

export function TopPagesTable({ pages }: TopPagesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Trang</CardTitle>
        <CardDescription>Trang web được xem nhiều nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-90 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                  <TableHead>Trang</TableHead>
                <TableHead className="text-right">Lượt xem trang</TableHead>
                <TableHead className="text-right">Người dùng</TableHead>
                <TableHead className="text-right">Thời gian trung bình</TableHead>
                <TableHead className="text-right">Tỷ lệ rời khỏi trang</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                pages.map((page, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{page.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {page.path}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {page.pageViews.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {page.activeUsers.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDuration(page.avgSessionDuration)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatBounceRate(page.bounceRate)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
