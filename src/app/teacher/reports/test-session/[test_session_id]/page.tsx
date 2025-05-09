import api from "@/lib/api";
import getToken from "@/lib/getToken";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  FileBarChart,
  Clock,
  Award,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { FaGraduationCap } from "react-icons/fa";
import { MdOutlineLeaderboard } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import Link from "next/link";

interface TestSery {
  title: string;
  exam_id: number;
  exam: {
    slug: string;
  };
}

interface StudentTestSession {
  session_start_time: string; // ISO 8601 format
  session_end_time: string; // ISO 8601 format
  test_series_id: number;
  test_sery: TestSery;
}

interface StudentResult {
  student_id: number;
  name: string;
  obtained_marks: number;
  total_marks: number;
  test_session_id: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    result_id: number;
    student_id: number;
    test_session_id: string;
    test_id: number;
    obtained_marks: number;
    total_marks: number;
    time_taken: number;
    correct_answers: number;
    wrong_answers: number;
    unattempted: number;
    negative_marks: number;
    total_questions: number;
    createdAt: string; // ISO 8601 format
    updatedAt: string; // ISO 8601 format
    student_test_session: StudentTestSession;
  };
  rank: number;
  percentage: number;
  no_of_students: number;
  no_of_sections: number;
  test_name: string;
  duration: number;
  subject_names: string[];
  top_rankers: StudentResult[];
}

const formatTime = (seconds: number): string => {
  if (seconds < 0) return "N/A";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${remainingSeconds}s`;
};

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ test_session_id: string }>;
  searchParams: Promise<{ student_id: string | undefined }>;
}) => {
  const { test_session_id } = await params;
  const { student_id } = await searchParams;

  let resultData = null;
  let error = null;

  try {
    const response = await api.get<ApiResponse>(
      `/api/v1/student/results/${test_session_id}`,
      {
        data: {
          student_id: student_id,
        },
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    resultData = response.data;
  } catch (err) {
    console.error("Error fetching test session data:", err);
    error =
      err instanceof Error ? err.message : "Failed to fetch test session data";
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {error ? (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-6">
            <Button variant="outline" size="sm" asChild className="mr-4">
              <Link href="/teacher/reports">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Reports
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Test Session Results</h1>
          </div>

          {resultData && (
            <div className="space-y-6">
              {/* Test Information */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {resultData.test_name}
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center mt-1">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>
                            Test Series:{" "}
                            {
                              resultData.data.student_test_session.test_sery
                                .title
                            }
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      Session ID: {test_session_id.substring(0, 8)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Duration
                        </p>
                        <p className="font-medium">
                          {formatTime(resultData.duration * 60)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <IoMdTime className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Time Taken
                        </p>
                        <p className="font-medium">
                          {formatTime(resultData.data.time_taken)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Students
                        </p>
                        <p className="font-medium">
                          {resultData.no_of_students}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Student Performance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Score Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <FaGraduationCap className="h-5 w-5 mr-2" />
                      Student Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Student</span>
                        <span className="font-medium">
                          {student_id ? `ID: ${student_id}` : "N/A"}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Score</span>
                        <span className="font-medium">
                          {resultData.data.obtained_marks} /{" "}
                          {resultData.data.total_marks}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Percentage
                        </span>
                        <Badge
                          variant={
                            resultData.percentage >= 60
                              ? "default"
                              : "destructive"
                          }
                        >
                          {resultData.percentage.toFixed(2)}%
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Rank</span>
                        <Badge variant="outline" className="font-bold">
                          {resultData.rank} / {resultData.no_of_students}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Questions Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <FileBarChart className="h-5 w-5 mr-2" />
                      Questions Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            Correct Answers
                          </p>
                          <div className="flex justify-between">
                            <p className="font-medium">
                              {resultData.data.correct_answers}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {(
                                (resultData.data.correct_answers /
                                  resultData.data.total_questions) *
                                100
                              ).toFixed(1)}
                              %
                            </p>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center">
                        <XCircle className="h-5 w-5 mr-3 text-red-500" />
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            Wrong Answers
                          </p>
                          <div className="flex justify-between">
                            <p className="font-medium">
                              {resultData.data.wrong_answers}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {(
                                (resultData.data.wrong_answers /
                                  resultData.data.total_questions) *
                                100
                              ).toFixed(1)}
                              %
                            </p>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 mr-3 text-amber-500" />
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            Unattempted
                          </p>
                          <div className="flex justify-between">
                            <p className="font-medium">
                              {resultData.data.unattempted}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {(
                                (resultData.data.unattempted /
                                  resultData.data.total_questions) *
                                100
                              ).toFixed(1)}
                              %
                            </p>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center">
                        <div className="h-5 w-5 mr-3 flex items-center justify-center">
                          <span className="text-red-500 font-bold">-</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            Negative Marks
                          </p>
                          <p className="font-medium">
                            {resultData.data.negative_marks}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Subject-wise Analysis */}
              {resultData.subject_names.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Subject-wise Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead className="text-right">
                              Questions
                            </TableHead>
                            <TableHead className="text-right">
                              Correct
                            </TableHead>
                            <TableHead className="text-right">Wrong</TableHead>
                            <TableHead className="text-right">
                              Unattempted
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {resultData.subject_names.map((subject, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {subject}
                              </TableCell>
                              <TableCell className="text-right">-</TableCell>
                              <TableCell className="text-right">-</TableCell>
                              <TableCell className="text-right">-</TableCell>
                              <TableCell className="text-right">-</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Top Performers */}
              {resultData.top_rankers && resultData.top_rankers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <MdOutlineLeaderboard className="h-5 w-5 mr-2" />
                      Top Performers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Rank</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                            <TableHead className="text-right">
                              Percentage
                            </TableHead>
                            <TableHead className="text-right">
                              Reports
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {resultData.top_rankers.map((ranker, index) => (
                            <TableRow
                              key={ranker.test_session_id}
                              className={
                                test_session_id === ranker.test_session_id
                                  ? "bg-primary/10"
                                  : ""
                              }
                            >
                              <TableCell>
                                {index === 0 ? (
                                  <div className="flex items-center">
                                    <span className="mr-1 w-2.5">
                                      {index + 1}
                                    </span>
                                    <FaStar
                                      className="text-yellow-500"
                                      title="Gold"
                                    />
                                  </div>
                                ) : index === 1 ? (
                                  <div className="flex items-center">
                                    <span className="mr-1 w-2.5">
                                      {index + 1}
                                    </span>
                                    <FaStar
                                      className="text-gray-400"
                                      title="Silver"
                                    />
                                  </div>
                                ) : index === 2 ? (
                                  <div className="flex items-center">
                                    <span className="mr-1 w-2.5">
                                      {index + 1}
                                    </span>
                                    <FaStar
                                      className="text-amber-700"
                                      title="Bronze"
                                    />
                                  </div>
                                ) : (
                                  index + 1
                                )}
                              </TableCell>
                              <TableCell className="font-medium">
                                {ranker.name}
                              </TableCell>
                              <TableCell className="text-right">
                                {ranker.obtained_marks} / {ranker.total_marks}
                              </TableCell>
                              <TableCell className="text-right">
                                {(
                                  (ranker.obtained_marks / ranker.total_marks) *
                                  100
                                ).toFixed(2)}
                                %
                              </TableCell>
                              <TableCell className="text-right">
                                <Link
                                  href={`/teacher/reports/test-session/${ranker.test_session_id}?student_id=${ranker.student_id}`}
                                  className="text-primary hover:text-primary-dark"
                                >
                                  View Report
                                  <ExternalLink className="h-3 w-3 ml-1 inline" />
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
