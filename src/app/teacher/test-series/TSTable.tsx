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

interface TestSeries {
  test_series_id: number;
  exam_id: number;
  academy_id: number;
  title: string;
  language: string;
  hash: string;
  description: string;
  cover_photo: string | null;
  total_tests: number | null;
  free_tests: number | null;
  price: number;
  price_before_discount: number;
  discount: number;
  discountType: string;
  is_paid: number;
  status: number;
  difficulty_level: string;
  is_purchased: number;
  is_deleted: number;
  average_rating: number | null;
  createdAt: string;
  updatedAt: string;
}

const TSTable = ({ data }: { data: TestSeries[] }) => {
  const renderStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge>Live</Badge>;
      case 2:
        return <Badge variant={"destructive"}>Unlisted</Badge>;
      default:
        return <Badge variant={"outline"}>Draft</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px] font-bold">#</TableHead>
          <TableHead className="font-bold text-xl">Test Series Name</TableHead>
          <TableHead className="font-bold text-xl">Tests</TableHead>
          <TableHead className="font-bold text-xl">Students</TableHead>
          <TableHead className="font-bold text-xl">Price</TableHead>
          <TableHead className="font-bold text-xl">Ratings</TableHead>
          <TableHead className="font-bold text-xl">Status</TableHead>
          <TableHead className="font-bold text-xl">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((ts, id) => (
          <TableRow key={ts.test_series_id}>
            <TableCell>{id + 1}</TableCell>
            <TableCell>
              <Button
                variant={"link"}
                asChild
                className="text-blue-600 hover:text-blue-700 p-0"
              >
                <Link href={`/teacher/test-series/${ts?.test_series_id}`}>
                  {ts?.title}
                </Link>
              </Button>
            </TableCell>
            <TableCell>{ts?.total_tests ?? 0}</TableCell>
            <TableCell></TableCell>
            <TableCell>{ts?.price}</TableCell>
            <TableCell>{ts?.average_rating}</TableCell>
            <TableCell className="text-center">
              {renderStatusBadge(ts?.status)}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TSTable;
