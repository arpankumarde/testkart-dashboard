import api from "@/lib/api";
import getToken from "@/lib/getToken";
import Link from "next/link";

interface TopStudent {
  student_id: number;
  name: string;
  obtained_marks: number | null;
  time_taken: number | null;
  test_session_id: string;
}

interface TestData {
  test_id: number;
  title: string;
  reviews: string[];
  time_spent: number | null;
  obtained_marks: number | null;
  total_attempts: number;
  top_students: TopStudent[];
}

interface ApiResponse {
  data: TestData[];
}

const Page = async ({ params }: { params: Promise<{ tsid: string }> }) => {
  const { tsid } = await params;
  const token = await getToken();
  try {
    const { data }: { data: ApiResponse } = await api.get(
      `/api/v1/studio/academy/test-report-detail/${tsid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(data.data);

    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">
          Test Reports
        </h1>
        <div className="space-y-6">
          {data.data.map((test: TestData) => (
            <div
              key={test.test_id}
              className="p-4 bg-white shadow-md rounded-lg border border-gray-200"
            >
              <h2 className="font-semibold text-2xl text-gray-800 mb-2">
                {test.title}
              </h2>
              <p className="text-gray-600">
                Total Attempts:{" "}
                <span className="font-medium">{test.total_attempts}</span>
              </p>
              <p className="text-gray-600">
                Time Spent:{" "}
                <span className="font-medium">
                  {test.time_spent?.toFixed(2) ?? 0} minutes
                </span>
              </p>
              <p className="text-gray-600">
                Obtained Marks:{" "}
                <span className="font-medium">
                  {test.obtained_marks?.toFixed(2) ?? 0}
                </span>
              </p>
              <h3 className="mt-4 text-lg font-semibold">Top Students</h3>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {test.top_students.map((student) => (
                  <li key={student.test_session_id}>
                    <span className="font-medium">{student.name}</span> -{" "}
                    {student.obtained_marks?.toFixed(2) ?? 0} marks -{" "}
                    {student.time_taken} seconds -{" "}
                    <Link
                      href={`/report/test-session/${student.test_session_id}`}
                      className="font-medium"
                    >
                      View Session
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching test report:", error);
    return <div>Error fetching test report</div>;
  }
};

export default Page;
