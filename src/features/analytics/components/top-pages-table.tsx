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
        <CardTitle>Top Pages</CardTitle>
        <CardDescription>Most viewed pages on your site</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead className="text-right">Page Views</TableHead>
              <TableHead className="text-right">Users</TableHead>
              <TableHead className="text-right">Avg. Duration</TableHead>
              <TableHead className="text-right">Bounce Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No data available
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
      </CardContent>
    </Card>
  );
}
