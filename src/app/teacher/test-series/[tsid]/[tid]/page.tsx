import api from "@/lib/api";
import getToken from "@/lib/getToken";
import Panel from "./Panel";

interface Subject {
  label: string;
  subject_id: number;
  inclued: boolean;
  total_questions: number;
  question_count: number;
}

interface Exam {
  exam_id: number;
  exam: string;
  default_pattern: string;
}

interface TestSeries {
  title: string;
  exam: Exam;
}

interface Test {
  test_id: number;
  test_series_id: number;
  academy_id: number;
  title: string;
  duration: number;
  subjects: Subject[];
  status: number;
  is_deleted: number;
  scheduled_on: string;
  is_scheduled: number;
  is_paid: number;
  createdAt: string;
  updatedAt: string;
  test_sery: TestSeries;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Test[];
}

const Page = async ({
  params,
}: {
  params: Promise<{ tsid: string; tid: string }>;
}) => {
  try {
    const { tsid, tid } = await params;

    if (!tsid || !tid) {
      return <div>Error: Missing Test Series ID or Test ID</div>;
    }

    const { data }: { data: ApiResponse } = await api.get(
      `/api/v1/test-series/test/${tid}`,
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    const subjects = data.data[0].subjects.filter((s) => s.inclued);

    console.log(data);

    return (
      <div>
        Test Series ID: {tsid}, Test ID: {tid}
        <br />
        <h2>Subjects</h2>
        <p>
          {subjects.map((subject) => (
            <span key={subject.subject_id}>
              {subject.label} ({subject.question_count} /{" "}
              {subject.total_questions}),{" "}
            </span>
          ))}
        </p>
        <div>
          <Panel test={data?.data[0]} />
        </div>
      </div>
    );
  } catch (error) {
    return <div>Failed to fetch questions</div>;
  }
};

export default Page;
