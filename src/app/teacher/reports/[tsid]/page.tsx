import api from "@/lib/api";
import getToken from "@/lib/getToken";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ClipboardList,
  Clock,
  Award,
  Users,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

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

    // Filter tests with more than 0 attempts
    const filteredTests = data.data.filter((test) => test.total_attempts > 0);

    return (
      <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-primary">Test Reports</h1>
            <Link
              href="/teacher/reports"
              className="text-sm text-primary hover:underline flex items-center"
            >
              <span>Back to All Reports</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {filteredTests.length > 0 ? (
            <div className="space-y-8">
              {filteredTests.map((test: TestData) => (
                <Card
                  key={test.test_id}
                  className="overflow-hidden border-gray-200 shadow-lg hover:shadow-xl transition-all"
                >
                  <CardHeader className="bg-white border-b border-gray-100">
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      {test.title}
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                      Test ID: {test.test_id}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                        <Users className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                          <p className="text-sm text-blue-600 font-medium">
                            Total Attempts
                          </p>
                          <p className="text-xl font-bold text-blue-700">
                            {test.total_attempts}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center p-4 bg-green-50 rounded-lg">
                        <Clock className="h-8 w-8 text-green-500 mr-3" />
                        <div>
                          <p className="text-sm text-green-600 font-medium">
                            Avg. Time Spent
                          </p>
                          <p className="text-xl font-bold text-green-700">
                            {test.time_spent?.toFixed(2) ?? 0} min
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                        <Award className="h-8 w-8 text-purple-500 mr-3" />
                        <div>
                          <p className="text-sm text-purple-600 font-medium">
                            Avg. Marks
                          </p>
                          <p className="text-xl font-bold text-purple-700">
                            {test.obtained_marks?.toFixed(2) ?? 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center mb-4">
                        <ClipboardList className="h-5 w-5 text-primary mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">
                          Top Performing Students
                        </h3>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs uppercase bg-gray-50 text-gray-700">
                            <tr>
                              <th className="px-4 py-3">Rank</th>
                              <th className="px-4 py-3">Student Name</th>
                              <th className="px-4 py-3">Marks</th>
                              <th className="px-4 py-3">Time Taken</th>
                              <th className="px-4 py-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {test.top_students.map((student, index) => (
                              <tr
                                key={index}
                                className="bg-white border-b hover:bg-gray-50"
                              >
                                <td className="px-4 py-3 font-medium">
                                  #{index + 1}
                                </td>
                                <td className="px-4 py-3 font-medium text-gray-800">
                                  {student.name}
                                </td>
                                <td className="px-4 py-3">
                                  {student.obtained_marks?.toFixed(2) ?? 0}
                                </td>
                                <td className="px-4 py-3">
                                  {formatTime(student.time_taken ?? 0)}
                                </td>
                                <td className="px-4 py-3">
                                  <Link
                                    href={`/teacher/reports/test-session/${student.test_session_id}`}
                                    className="text-primary hover:text-primary-dark font-medium flex items-center"
                                  >
                                    View Details
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No Test Attempts Found
              </h2>
              <p className="text-gray-500">
                There are no tests with attempted submissions.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching test report:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Report
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't fetch the requested test report data.
          </p>
          <Link href="/teacher/reports">
            <Button>Return to Reports</Button>
          </Link>
        </div>
      </div>
    );
  }
};

// Helper function to format seconds into minutes and seconds
const formatTime = (seconds: number): string => {
  if (!seconds) return "0s";

  const mins = Math.floor(seconds / 60);
  const secs = Math.round((seconds % 60) * 100) / 100;

  if (mins === 0) {
    return secs % 1 === 0 ? `${secs}s` : `${secs.toFixed(2)}s`;
  }
  return secs % 1 === 0 ? `${mins}m ${secs}s` : `${mins}m ${secs.toFixed(2)}s`;
};

export default Page;
