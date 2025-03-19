import api from "@/lib/api";
import getToken from "@/lib/getToken";
import TSCreateForm from "./TSCreateForm";

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
    <div className="p-4">
      <h1>Create New Test Series</h1>

      <TSCreateForm data={data.data} />
    </div>
  );
};

export default Page;
