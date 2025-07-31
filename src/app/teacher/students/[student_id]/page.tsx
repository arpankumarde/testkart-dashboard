import api from "@/lib/api";
import getToken from "@/lib/getToken";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface TestSeries {
  title: string;
  price: number;
  is_paid: number;
}

interface PurchaseData {
  test_series_id: number;
  purchase_time: string;
  test_sery: TestSeries;
  user_student: {
    name: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: PurchaseData[];
}

const Page = async ({
  params,
}: {
  params: Promise<{ student_id: number }>;
}) => {
  try {
    const { student_id } = await params;
    const { data }: { data: ApiResponse } = await api.get(
      `/api/v1/studio/academy/student-report/${student_id}`,
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    // Calculate total amount spent
    const totalSpent =
      data?.data?.reduce(
        (sum, purchase) => sum + purchase.test_sery.price,
        0
      ) || 0;

    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <Link
              href="/teacher/students"
              className="text-sm flex items-center text-gray-500 hover:text-gray-700 mb-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Students
            </Link>
            <h1 className="text-2xl font-semibold text-gray-800">
              {data?.data?.[0]?.user_student?.name || "Unnamed Student"}
            </h1>
            <p className="text-gray-500 mt-1">
              Student ID: {student_id} • Purchase History
            </p>
          </div>
          <div className="bg-primary/10 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-800">Total Spent</p>
            <p className="text-xl font-semibold text-primary">
              ₹ {totalSpent.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="rounded-md border shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[80px] font-semibold">Sl No.</TableHead>
                <TableHead className="font-semibold">Test Series</TableHead>
                <TableHead className="font-semibold text-right">
                  Price
                </TableHead>
                <TableHead className="font-semibold text-right">
                  Purchase Time
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-gray-500"
                  >
                    No purchase history found
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((purchase, index) => {
                  let formattedTime;
                  try {
                    const purchaseDate = new Date(purchase.purchase_time);

                    // Get date components
                    const day = purchaseDate
                      .getDate()
                      .toString()
                      .padStart(2, "0");
                    const month = new Intl.DateTimeFormat("en-US", {
                      month: "short",
                    }).format(purchaseDate);
                    const year = purchaseDate.getFullYear();

                    // Get time components
                    let hours = purchaseDate.getHours();
                    const ampm = hours >= 12 ? "PM" : "AM";
                    hours = hours % 12;
                    hours = hours ? hours : 12; // Convert 0 to 12 for 12 AM
                    const minutes = purchaseDate
                      .getMinutes()
                      .toString()
                      .padStart(2, "0");

                    formattedTime = `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
                  } catch (e) {
                    formattedTime = purchase.purchase_time;
                  }

                  return (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {purchase.test_sery.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            Series ID: {purchase.test_series_id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-medium ${
                            purchase.test_sery.is_paid
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          ₹ {purchase.test_sery.price.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-gray-600">
                        {formattedTime}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
    return (
      <div className="p-6 text-center">
        <div className="rounded-md border border-red-200 bg-red-50 p-4 max-w-md mx-auto">
          <h2 className="text-lg font-medium text-red-800">Error</h2>
          <p className="mt-2 text-red-600">
            Failed to load student data. Please try again later.
          </p>
          <div className="mt-4 space-x-3">
            <Link href="/teacher/students">
              <Button variant="outline" className="bg-white">
                Return to All Students
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default Page;
