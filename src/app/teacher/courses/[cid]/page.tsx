import api from "@/lib/api";
import { Course } from "@/types/course";
import EachCourse from "./EachCourse";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import getToken from "@/lib/getToken";

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

  return (
    <div className="p-2 lg:p-4">
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div>
            <h1 className="text-xl font-medium">{data?.data?.course?.title}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant={"outline"}>
              <Link href={`/teacher/courses/${cid}/edit`}>Edit Course</Link>
            </Button>
            <Button asChild variant={"secondary"}>
              <Link href={`/teacher/courses/listing/${cid}`}>
                Listing Status
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/teacher/courses/${cid}/create`}>
                Add New Content
              </Link>
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">Course ID: {cid}</div>
      </div>

      <Separator className="my-2 lg:my-4 border-primary border-1" />

      <EachCourse cid={cid} course={data?.data?.course} />
    </div>
  );
};

export default Page;
