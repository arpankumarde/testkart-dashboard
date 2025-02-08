import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

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

const TTable = ({ data }: { data: Test[] }) => {
  const renderStatusBadge = (meta: TestMeta) => {
    switch (meta.questions_count >= meta.total_questions) {
      case true:
        return <Badge>Complete</Badge>;
      case false:
        return <Badge variant={"destructive"}>Incomplete</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px] font-bold">#</TableHead>
          <TableHead className="font-bold text-xl">Test Name</TableHead>
          <TableHead className="font-bold text-xl">Subjects</TableHead>
          <TableHead className="font-bold text-xl">Questions</TableHead>
          <TableHead className="font-bold text-xl">Duration</TableHead>
          <TableHead className="font-bold text-xl">Status</TableHead>
          <TableHead className="font-bold text-xl">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((ts, id) => (
          <TableRow key={ts?.data?.test_id}>
            <TableCell>{id + 1}</TableCell>
            <TableCell>
              <Button
                variant={"link"}
                asChild
                className="text-blue-600 hover:text-blue-700 p-0"
              >
                <Link
                  href={`/teacher/test-series/${ts?.data?.test_series_id}/${ts?.data?.test_id}`}
                >
                  {ts?.data?.title}
                </Link>
              </Button>
            </TableCell>
            <TableCell>
              {ts?.data?.subjects
                .filter((s) => s.inclued)
                .map((s) => s.label)
                .join(", ")}
            </TableCell>
            <TableCell>
              {ts?.meta?.questions_count ?? 0}/{ts?.meta?.total_questions ?? 0}
            </TableCell>
            <TableCell>{ts?.data?.duration}</TableCell>{" "}
            <TableCell className="text-center">
              {renderStatusBadge(ts?.meta)}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TTable;
