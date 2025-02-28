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
import Link from "next/link";

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

    console.log(data);

    return (
      <div>
        <div>
          <h1 className="font-medium text-xl">Students</h1>
        </div>

        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Sl No.</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-center">Series Bought</TableHead>
                <TableHead className="text-right">Amount Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Link
                      href={`/teacher/students/${student.student_id}`}
                      className="text-blue-700 hover:underline underline-offset-2"
                    >
                      {student.student_id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/teacher/students/${student.student_id}`}
                      className="text-blue-700 hover:underline underline-offset-2"
                    >
                      {student.student_name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    {student.test_series_purchased}
                  </TableCell>
                  <TableCell className="text-right">
                    Rs. {student.total_price.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  } catch (error) {
    return <div>Failed to fetch students</div>;
  }
};

export default Page;
