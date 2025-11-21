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
      label: "Người dùng hoạt động",
      color: "#3b82f6", // Blue - primary metric
    },
    newUsers: {
      label: "Người dùng mới",
      color: "#10b981", // Green - growth metric
    },
    sessions: {
      label: "Lượt truy cập",
      color: "#8b5cf6", // Purple - engagement metric
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> Lượt truy cập theo thời gian</CardTitle>
        <CardDescription>
          Theo dõi người dùng hoạt động, người dùng mới và lượt truy cập
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="dateFormatted"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke={chartConfig.activeUsers.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
                name="Người dùng hoạt động"
              />
              <Line
                type="monotone"
                dataKey="newUsers"
                stroke={chartConfig.newUsers.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
                name="Người dùng mới"
              />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke={chartConfig.sessions.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
                name="Lượt truy cập"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
