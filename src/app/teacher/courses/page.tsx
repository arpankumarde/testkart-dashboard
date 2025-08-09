"use client";

import { useState, useEffect } from "react";
import LoaderComponent from "@/components/blocks/LoaderComponent";
import api from "@/lib/api";
import getTokenClient from "@/lib/getTokenClient";
import type { Course } from "@/types/course";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { EllipsisVertical } from "lucide-react";

const Page = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getTokenClient();
        const response = await api.get("/api/v1/courses", {
          headers: {
            user_type: "TEACHER",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setCourses(response.data.data.courses);
        } else {
          setError(response.data.message || "Failed to fetch courses");
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("An error occurred while fetching courses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoaderComponent />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <div className="text-2xl font-semibold mb-4 flex justify-between">
        <h1>Courses</h1>
        <Button asChild>
          <Link href="/teacher/courses/create">Create Course</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] font-semibold">#</TableHead>
            <TableHead className="font-semibold">Course Title</TableHead>
            <TableHead className="font-semibold">Price</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses?.map((course, id) => (
            <TableRow key={course.id}>
              <TableCell>{id + 1}</TableCell>
              <TableCell className="max-w-48 whitespace-normal">
                <Link
                  href={`/teacher/courses/${course.id}`}
                  className="text-blue-600 hover:text-blue-700 underline underline-offset-4"
                >
                  {course.title || "Untitled"}
                </Link>
              </TableCell>
              <TableCell>
                {course.price > 0 ? `₹${course.price}` : "Free"}
              </TableCell>
              <TableCell>
                <Badge variant={course.is_published ? "default" : "secondary"}>
                  {course.is_published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 m-0">
                      <EllipsisVertical size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link href={`/teacher/courses/${course.id}/edit`}>
                        Edit Course
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
