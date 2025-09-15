import api from "@/lib/api";
import getToken from "@/lib/getToken";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Course } from "@/types/course";
import AddContentForm from "./AddContentForm";

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    course: Course;
  };
}

const Page = async ({ params }: { params: Promise<{ cid: string }> }) => {
  const { cid } = await params;
  const { data }: { data: ApiResponse } = await api.get(
    `/api/v1/courses/${cid}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  if (!data?.success) {
    throw new Error("Failed to fetch test series data");
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/teacher/courses/${cid}`}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-bold">Add New Content</h1>
          <p className="text-muted-foreground">
            Course: {data.data.course.title}
          </p>
        </div>
      </div>

      <Separator className="my-2 lg:my-4" />

      <AddContentForm
        data={data?.data?.course}
        existingContentCount={data?.data?.course?.contents.length}
      />
    </div>
  );
};

export default Page;
