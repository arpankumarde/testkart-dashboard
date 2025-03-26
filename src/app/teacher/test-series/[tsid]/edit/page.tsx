import api from "@/lib/api";
import getToken from "@/lib/getToken";
import TSEditForm from "./TSEditForm";

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

const Page = async ({ params }: { params: Promise<{ tsid: number }> }) => {
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
    <div className="p-4">
      <h1>Edit Test Series: {data?.data?.title}</h1>
      <p>Please make your changes below: </p>

      <TSEditForm data={data?.data} tsid={tsid} />
    </div>
  );
};

export default Page;
