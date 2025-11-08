"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { format, parse } from "date-fns";

interface VisitorData {
  date: string;
  activeUsers: number;
  newUsers: number;
  sessions: number;
}

interface VisitorsChartProps {
  data: VisitorData[];
}

export function VisitorsChart({ data }: VisitorsChartProps) {
  const chartData = data.map((item) => {
    // Google Analytics dates come in YYYYMMDD format
    const dateStr = item.date;
    const parsedDate = parse(dateStr, "yyyyMMdd", new Date());
    return {
      ...item,
      dateFormatted: format(parsedDate, "MMM dd"),
    };
  });

  const chartConfig = {
    activeUsers: {
      label: "Active Users",
      color: "hsl(var(--chart-1))",
    },
    newUsers: {
      label: "New Users",
      color: "hsl(var(--chart-2))",
    },
    sessions: {
      label: "Sessions",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Over Time</CardTitle>
        <CardDescription>
          Track active users, new users, and sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="dateFormatted"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke={chartConfig.activeUsers.color}
                strokeWidth={2}
                dot={false}
                name="Active Users"
              />
              <Line
                type="monotone"
                dataKey="newUsers"
                stroke={chartConfig.newUsers.color}
                strokeWidth={2}
                dot={false}
                name="New Users"
              />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke={chartConfig.sessions.color}
                strokeWidth={2}
                dot={false}
                name="Sessions"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
