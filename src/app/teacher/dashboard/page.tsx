"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import getTokenClient from "@/lib/getTokenClient";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import {
  BookOpen,
  FileText,
  IndianRupee,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface WidgetData {
  total: number | string;
  change: number | string;
}

interface WeeklyMonthlyYearly {
  weekly: WidgetData;
  monthly: WidgetData;
  yearly: WidgetData;
}

interface Widgets {
  students: WeeklyMonthlyYearly;
  earnings: WeeklyMonthlyYearly;
  test_series_sell: WeeklyMonthlyYearly;
  tests_taken: WeeklyMonthlyYearly;
}

interface GraphData {
  month: string;
  income: number;
}

interface EarningsOverview {
  total: number;
  last_month: number;
  last_week: number;
}

interface Earnings {
  overview: EarningsOverview;
  graph: GraphData[];
}

interface RecentTestSeries {
  test_series_id: number;
  exam_id: number;
  academy_id: number;
  title: string;
  language: string;
  hash: string;
  description: string;
  cover_photo: string;
  total_tests: number | null;
  free_tests: number;
  price: number;
  price_before_discount: number;
  discount: number;
  discountType: string;
  is_paid: number;
  status: number;
  difficulty_level: string;
  is_purchased: number;
  is_deleted: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    widgets: Widgets;
    earnings: Earnings;
    recent_test_series: RecentTestSeries[];
    recent_comments: any[];
  };
}

const Page = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "yearly">(
    "monthly"
  );
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse>("/api/v1/studio/dashboard", {
        headers: {
          Authorization: `Bearer ${await getTokenClient()}`,
        },
      });

      setData(res?.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatChange = (change: number | string) => {
    const numChange = typeof change === "string" ? parseFloat(change) : change;
    return numChange >= 0 ? `+${numChange}%` : `${numChange}%`;
  };

  const getChangeColor = (change: number | string) => {
    const numChange = typeof change === "string" ? parseFloat(change) : change;
    return numChange >= 0 ? "text-green-600" : "text-red-600";
  };

  const getChangeIcon = (change: number | string) => {
    const numChange = typeof change === "string" ? parseFloat(change) : change;
    return numChange >= 0 ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingDown className="w-4 h-4" />
    );
  };

  const widgets = [
    {
      title: "Students",
      icon: Users,
      key: "students" as keyof Widgets,
      color: "text-blue-600",
    },
    {
      title: "Earnings",
      icon: IndianRupee,
      key: "earnings" as keyof Widgets,
      color: "text-green-600",
    },
    {
      title: "Series Sold",
      icon: BookOpen,
      key: "test_series_sell" as keyof Widgets,
      color: "text-purple-600",
    },
    {
      title: "Tests Taken",
      icon: FileText,
      key: "tests_taken" as keyof Widgets,
      color: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="pt-0">
              <CardHeader className="bg-primary pt-4 pb-2 rounded-t-lg text-white">
                <div className="h-6 bg-white/20 rounded animate-pulse" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6 p-4">
        <div className="p-4 space-y-4 bg-gray-100 rounded-xl">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-2xl">Overview</h2>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="capitalize">
                  {timeframe}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTimeframe("weekly")}>
                  Weekly
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeframe("monthly")}>
                  Monthly
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeframe("yearly")}>
                  Yearly
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {widgets.map((widget) => {
              const widgetData = data?.data?.widgets[widget.key]?.[timeframe];
              const Icon = widget.icon;

              return (
                <Card key={widget.title} className="pt-0">
                  <CardHeader className="bg-primary pt-4 pb-2 rounded-t-lg text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      {widget.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {widgetData?.total || 0}
                    </div>
                    <div
                      className={`text-sm flex items-center gap-1 ${getChangeColor(
                        widgetData?.change || 0
                      )}`}
                    >
                      {getChangeIcon(widgetData?.change || 0)}
                      {formatChange(widgetData?.change || 0)} from last{" "}
                      {timeframe.slice(0, -2)}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-8 gap-4">
          <Card className="md:col-span-5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5" />
                Earnings Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    Total Earnings
                  </div>
                  <div className="text-2xl font-bold">
                    ₹
                    {data?.data?.earnings?.overview?.total?.toLocaleString() ||
                      0}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    Last Month
                  </div>
                  <div className="text-xl font-semibold">
                    ₹
                    {data?.data?.earnings?.overview?.last_month?.toLocaleString() ||
                      0}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Last Week</div>
                  <div className="text-xl font-semibold">
                    ₹
                    {data?.data?.earnings?.overview?.last_week?.toLocaleString() ||
                      0}
                  </div>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.data?.earnings?.graph || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`₹${value}`, "Income"]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#6C44A3"
                      strokeWidth={2}
                      dot={{ fill: "#6C44A3", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3 py-4 gap-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Top Test Series</span>
                <Button variant={"secondary"} size={"sm"} asChild>
                  <Link href="/teacher/test-series">View All</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="px-2">
              {data?.data?.recent_test_series.map((series) => (
                <Link
                  key={series?.test_series_id}
                  target="_blank"
                  href={`https://testkart.in/test-series/${series?.hash}`}
                  className="flex gap-2 hover:bg-primary/10 p-2 rounded-lg"
                >
                  <Image
                    src={series?.cover_photo || "/"}
                    alt={series?.title}
                    width={80}
                    height={45}
                    className="object-cover aspect-video rounded-md"
                  />
                  <span className="text-sm">{series?.title}</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
