"use client";

import api from "@/lib/api";
import TSTable from "./TSTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import getTokenClient from "@/lib/getTokenClient";
import { useEffect, useState } from "react";
import LoaderComponent from "@/components/blocks/LoaderComponent";

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
  students_joined: number;
  unique_attempts: number;
  attempting_students: [];
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
          Authorization: `Bearer ${await getTokenClient()}`,
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

  return (
    <div className="space-y-4 p-4">
      <div className="text-2xl font-bold mb-4 flex justify-end">
        <Button asChild>
          <Link href="/teacher/test-series/create">Create Test Series</Link>
        </Button>
      </div>

      <TSTable data={data} />
    </div>
  );
};

export default Page;
