"use client";

import api from "@/lib/api";
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
import { useEffect, useState } from "react";
import getTokenClient from "@/lib/getTokenClient";
import LoaderComponent from "@/components/blocks/LoaderComponent";
import XLSX from "xlsx";
import { Download } from "lucide-react";
import { toast } from "sonner";

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

const Page = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data }: { data: ApiResponse } = await api.get(
          "/api/v1/studio/academy/student-report",
          {
            headers: {
              Authorization: `Bearer ${getTokenClient()}`,
            },
          }
        );
        setData(data);
      } catch (error) {
        setData({ success: false, data: [] });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const downloadExcel = () => {
    if (!data?.data || data.data.length === 0) {
      toast.error("No data available to download");
      return;
    }

    const exportData = data.data.map((student, index) => ({
      "Sl No.": index + 1,
      "Student ID": student.student_id,
      Name: student.student_name,
      "Series Bought": student.test_series_purchased,
      "Amount Spent": student.total_price.toFixed(2),
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const columnWidths = [
      { wch: 8 },
      { wch: 12 },
      { wch: 25 },
      { wch: 15 },
      { wch: 18 },
    ];
    worksheet["!cols"] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Report");

    const currentDate = new Date().toISOString().split("T")[0];
    const filename = `testkart-students-${currentDate}.xlsx`;

    XLSX.writeFile(workbook, filename);
  };

  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="border-b pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Student Management
            </h1>
            <p className="text-gray-500 mt-1">
              View and manage all enrolled students
            </p>
          </div>
          <Button
            onClick={downloadExcel}
            disabled={!data?.data || data.data.length === 0}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Download Excel
          </Button>
        </div>
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
};

export default Page;
