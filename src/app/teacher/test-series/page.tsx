import api from "@/lib/api";
import getToken from "@/lib/getToken";
import TSTable from "./TSTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

const Page = async () => {
  try {
    const { data }: { data: ApiResponse } = await api.get(
      "/api/v1/test-series",
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    return (
      <div className="space-y-4 p-4">
        <div className="text-2xl font-bold mb-4 flex justify-end">
          <Button asChild>
            <Link href="/teacher/test-series/create">Create Test Series</Link>
          </Button>
        </div>

        <TSTable data={data.data} />
      </div>
    );
  } catch (error) {
    return <div>Failed to fetch Test Series</div>;
  }
};

export default Page;
