import api from "@/lib/api";
import getToken from "@/lib/getToken";
import TSCreateForm from "./TSCreateForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Subject {
  subject_id: number;
  subject: string;
}

interface DefaultPattern {
  subjects: Subject[];
  positive_marks: number;
  negative_marks: number;
  exam_duration: number;
}

interface ExamData {
  exam_id: number;
  exam: string;
  slug: string;
  category: string;
  status: number;
  default_pattern: DefaultPattern;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data: ExamData[];
}

const Page = async () => {
  const { data }: { data: ApiResponse } = await api.get(
    "/api/v1/exams/parsed",
    {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    }
  );

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild className="h-8 w-8">
              <Link href="/teacher/test-series">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              Create New Test Series
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground">
          Create a new test series by selecting an exam and filling in the
          details below.
        </p>
      </div>

      <TSCreateForm data={data.data} />
    </div>
  );
};

export default Page;
