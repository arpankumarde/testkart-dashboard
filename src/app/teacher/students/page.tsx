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
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Student {
  student_id: number;
  student_name: string;
  total_price: number;
  test_series_purchased: number;
}

interface ApiResponse {
  success: boolean;
  data: Student[];
}

const Page = async () => {
  try {
    const { data }: { data: ApiResponse } = await api.get(
      "/api/v1/studio/academy/student-report",
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    return (
      <div className="space-y-6 p-6">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Student Management
          </h1>
          <p className="text-gray-500 mt-1">
            View and manage all enrolled students
          </p>
        </div>

        <div className="rounded-md border shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[80px] font-semibold">Sl No.</TableHead>
                <TableHead className="font-semibold">Student ID</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="text-center font-semibold">
                  Series Bought
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Amount Spent
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((student, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <Link
                        href={`/teacher/students/${student.student_id}`}
                        className="text-blue-600 hover:underline underline-offset-2 font-medium"
                      >
                        {student.student_id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/teacher/students/${student.student_id}`}
                        className="text-blue-600 hover:underline underline-offset-2"
                      >
                        {student.student_name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">
                        {student.test_series_purchased}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹ {student.total_price.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="p-6 text-center">
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <h2 className="text-lg font-medium text-red-800">Error</h2>
          <p className="mt-2 text-red-600">
            Failed to fetch students. Please try again later.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }
};

export default Page;
