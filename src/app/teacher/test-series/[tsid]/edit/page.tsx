import api from "@/lib/api";
import getToken from "@/lib/getToken";
import TSEditForm from "./TSEditForm";
import Link from "next/link";

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
  const { tsid } = await params;
  const { data }: { data: ApiResponse } = await api.get(
    `/api/v1/test-series/${tsid}`,
    {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    }
  );

  console.log(data);

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <div className="space-y-2 mb-8">
        <nav className="flex items-center text-sm text-muted-foreground">
          <ol className="flex items-center space-x-2">
            <li>
              <a href="/teacher" className="hover:text-primary">
                Dashboard
              </a>
            </li>
            <li>
              <span>/</span>
            </li>
            <li>
              <Link href="/teacher/test-series" className="hover:text-primary">
                Test Series
              </Link>
            </li>
            <li>
              <span>/</span>
            </li>
            <li>
              <span className="text-foreground font-medium">Edit</span>
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight">
          {data?.data?.title}
        </h1>
        <p className="text-muted-foreground">
          Update your test series details and configuration below
        </p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border bg-card text-card-foreground shadow">
          <div className="p-6">
            <TSEditForm data={data?.data} tsid={tsid} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
