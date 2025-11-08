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

interface ReferrerData {
  source: string;
  medium: string;
  sessions: number;
  activeUsers: number;
  bounceRate: number;
}

interface TopReferrersTableProps {
  referrers: ReferrerData[];
}

function formatBounceRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

export function TopReferrersTable({ referrers }: TopReferrersTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Referrers</CardTitle>
        <CardDescription>Where your visitors are coming from</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Medium</TableHead>
              <TableHead className="text-right">Sessions</TableHead>
              <TableHead className="text-right">Users</TableHead>
              <TableHead className="text-right">Bounce Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              referrers.map((referrer, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {referrer.source}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {referrer.medium}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {referrer.sessions.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {referrer.activeUsers.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatBounceRate(referrer.bounceRate)}
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
