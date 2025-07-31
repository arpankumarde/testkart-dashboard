"use client";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import getTokenClient from "@/lib/getTokenClient";
import { useEffect, useState } from "react";
import LoaderComponent from "@/components/blocks/LoaderComponent";
import { BookOpen, Calendar, ChevronRight, FileBarChart } from "lucide-react";

interface ApiResponse {
  success: boolean;
  data: TestSeries[];
}

interface TestSeries {
  test_series_id: number;
  exam_id: number;
  academy_id: number;
  title: string;
  language: string;
  hash: string;
  description: string;
  cover_photo: string | null;
  total_tests: number | null;
  free_tests: number | null;
  price: number;
  price_before_discount: number;
  discount: number;
  discountType: string;
  is_paid: number;
  status: number;
  difficulty_level: string;
  is_purchased: number;
  is_deleted: number;
  average_rating: number | null;
  createdAt: string;
  updatedAt: string;
}

const Page = () => {
  const [data, setData] = useState<TestSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTestSeries = async () => {
    const { data }: { data: ApiResponse } = await api.get(
      "/api/v1/test-series",
      {
        headers: {
          Authorization: `Bearer ${getTokenClient()}`,
        },
      }
    );

    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchTestSeries();
        setData(result.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <LoaderComponent />;
  }

  // Filter to only show test series with tests
  const filteredData = data
    .filter(
      (testSeries) =>
        (testSeries.total_tests || 0) > 0 && testSeries.status !== 0
    )
    .sort((a, b) => {
      // Sort by status priority: 1 (Live) first, then 2 (Unlisted), then others
      if (a.status === 1 && b.status !== 1) return -1;
      if (a.status !== 1 && b.status === 1) return 1;
      if (a.status === 2 && b.status !== 2) return -1;
      if (a.status !== 2 && b.status === 2) return 1;
      return 0;
    });

  // Function to get status display text and color classes
  const getStatusInfo = (status: number) => {
    switch (status) {
      case 1:
        return {
          text: "Live",
          classes: "bg-green-100 text-green-800",
        };
      case 2:
        return {
          text: "Unlisted",
          classes: "bg-blue-100 text-blue-800",
        };
      default:
        return {
          text: "Draft",
          classes: "bg-gray-100 text-gray-800",
        };
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="text-2xl font-bold mb-6 border-b pb-4 flex items-center">
        <FileBarChart className="mr-2 h-6 w-6 text-primary" />
        <h1>Test Series Reports</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((testSeries) => (
          <div
            key={testSeries.test_series_id}
            className="p-5 border rounded-lg shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
          >
            {/* Color accent - different color based on status */}
            <div
              className={`absolute top-0 left-0 w-1 h-full ${
                testSeries.status === 1
                  ? "bg-green-500"
                  : testSeries.status === 2
                  ? "bg-blue-500"
                  : "bg-gray-500"
              }`}
            ></div>

            <h2 className="font-semibold text-lg line-clamp-1 pl-2">
              {testSeries.title}
            </h2>

            <div className="flex items-center mt-4 pl-2">
              <BookOpen className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm text-gray-600">
                {testSeries.total_tests || 0} Tests
              </span>
            </div>

            <div className="flex items-center mt-2 pl-2">
              <Calendar className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm text-gray-500">
                Created: {new Date(testSeries.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="mt-3 pl-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  getStatusInfo(testSeries.status).classes
                }`}
              >
                {getStatusInfo(testSeries.status).text}
              </span>
            </div>

            <div className="mt-6">
              <Button asChild size="sm" variant="outline" className="w-full">
                <Link
                  href={`/teacher/reviews/${testSeries.test_series_id}`}
                  className="flex items-center justify-center"
                >
                  <FileBarChart className="h-4 w-4 mr-2" />
                  View Reviews
                  <ChevronRight className="h-4 w-4 ml-1 opacity-70" />
                </Link>
              </Button>
            </div>
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            No test series with tests found. Add tests to your test series to
            see them here.
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
