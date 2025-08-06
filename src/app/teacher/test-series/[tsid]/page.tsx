import api from "@/lib/api";
import getToken from "@/lib/getToken";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TTable from "./TTable";
import { Separator } from "@/components/ui/separator";

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

interface ApiResponse2 {
  success: boolean;
  message: string;
  data: Test[];
}

interface Subject2 {
  label: string;
  subject_id: number;
  inclued: boolean;
  total_questions: number;
  question_count?: number;
}

interface TestData {
  test_id: number;
  test_series_id: number;
  academy_id: number;
  title: string;
  duration: number;
  subjects: Subject2[];
  status: number;
  is_deleted: number;
  scheduled_on: string | null;
  is_scheduled: number;
  is_paid: number;
  createdAt: string;
  updatedAt: string;
  average_rating: null;
}

interface TestMeta {
  total_questions: number;
  questions_count: number;
  subjects: string;
}

interface Test {
  data: TestData;
  meta: TestMeta;
}

const Page = async ({ params }: { params: Promise<{ tsid: string }> }) => {
  try {
    const tsid = (await params)?.tsid;
    const { data }: { data: ApiResponse } = await api.get(
      `/api/v1/test-series/${tsid}`,
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    const { data: data2 }: { data: ApiResponse2 } = await api.get(
      `/api/v1/test-series/test?series_id=${tsid}`,
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    return (
      <div className="p-2 lg:p-4">
        <div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div>
              <h1 className="text-xl font-medium">{data?.data?.title}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant={"outline"}>
                <Link href={`/teacher/test-series/${tsid}/edit`}>
                  Edit Test Series
                </Link>
              </Button>
              <Button asChild variant={"secondary"}>
                <Link href={`/teacher/listing/${tsid}`}>Listing Status</Link>
              </Button>
              <Button asChild>
                <Link href={`/teacher/test-series/${tsid}/create`}>
                  Add New Test
                </Link>
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Test Series ID: {tsid}
          </div>
        </div>

        <Separator className="my-2 lg:my-4 border-primary border-1" />

        <TTable data={data2?.data} />
      </div>
    );
  } catch (error) {
    console.error(error);
    return <div>Failed to fetch Tests</div>;
  }
};

export default Page;
