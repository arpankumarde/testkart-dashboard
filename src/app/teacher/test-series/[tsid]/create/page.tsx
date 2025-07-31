import api from "@/lib/api";
import getToken from "@/lib/getToken";
import AddTestForm from "./AddTestForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ApiResponse {
  success: boolean;
  data: TestSeries;
}

interface TestSeries {
  test_series_id: number;
  exam_id: number;
  academy_id: number;
  title: string;
  language: string;
  hash: string;
  description: string;
  cover_photo: string;
  total_tests: number;
  free_tests: number;
  price: number;
  price_before_discount: number;
  discount: number;
  discountType: string;
  is_paid: number;
  status: number;
  difficulty_level: string;
  is_purchased: number;
  is_deleted: number;
  createdAt: string;
  updatedAt: string;
  exam: Exam;
}

interface Subject {
  subject_id: number;
  subject: string;
  questions: number;
}

interface DefaultPattern {
  subjects: Subject[];
  positive_marks: number;
  negative_marks: number;
  exam_duration: number;
}

interface Exam {
  exam_id: number;
  exam: string;
  slug: string;
  category: number;
  status: number;
  default_pattern: DefaultPattern;
  createdAt: string;
  updatedAt: string;
}

const Page = async ({ params }: { params: Promise<{ tsid: string }> }) => {
  const tsid = (await params)?.tsid;
  const { data } = await api.get<ApiResponse>(`/api/v1/test-series/${tsid}`, {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  if (!data?.success) {
    throw new Error("Failed to fetch test series data");
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/teacher/test-series/${tsid}`}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-bold">Add New Test</h1>
          <p className="text-muted-foreground">
            Test Series: {data.data.title}
          </p>
        </div>
      </div>

      <Separator className="my-2 lg:my-4" />

      <Card className="border-l-4 border-l-primary pt-0">
        <CardHeader className="bg-primary/5 py-4">
          <CardTitle className="text-primary">Create Test</CardTitle>
          <CardDescription>
            Configure your test settings and select subjects
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <AddTestForm data={data?.data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
