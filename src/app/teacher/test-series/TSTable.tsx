"use client";

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { EllipsisVertical } from "lucide-react";
import { deleteTestSeries } from "@/actions/test-series";

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px] font-semibold">#</TableHead>
          <TableHead className="max-w-60 font-semibold">
            Test Series Name
          </TableHead>
          <TableHead className="font-semibold">Tests</TableHead>
          <TableHead className="font-semibold">Students</TableHead>
          <TableHead className="font-semibold">Price</TableHead>
          <TableHead className="font-semibold">Ratings</TableHead>
          <TableHead className="font-semibold text-center">Status</TableHead>
          <TableHead className="font-semibold text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((ts, id) => (
          <TableRow key={ts.test_series_id}>
            <TableCell>{id + 1}</TableCell>
            <TableCell className="max-w-48 whitespace-normal">
              <Link
                href={`/teacher/test-series/${ts?.test_series_id}`}
                className="text-blue-600 hover:text-blue-700 underline underline-offset-4"
              >
                {ts?.title}
              </Link>
            </TableCell>
            <TableCell>{ts?.total_tests ?? 0}</TableCell>
            <TableCell></TableCell>
            <TableCell>{ts?.price}</TableCell>
            <TableCell>{ts?.average_rating}</TableCell>
            <TableCell className="text-center">
              {renderStatusBadge(ts?.status)}
            </TableCell>
            <TableCell className="flex gap-2 items-center justify-around flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} className="p-0 m-0">
                    <EllipsisVertical size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href={`/teacher/test-series/${ts?.test_series_id}`}>
                      View Tests
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/teacher/reports/${ts?.test_series_id}`}>
                      View Reports
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/teacher/reviews/${ts?.test_series_id}`}>
                      View Reviews
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem>
                    <Link
                      href={`/teacher/test-series/${ts?.test_series_id}/edit`}
                    >
                      Edit Test Series
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className={ts?.status === 2 ? "" : "hidden"}
                  >
                    <Link href={`/teacher/reviews/${ts?.test_series_id}`}>
                      List Test Series
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <AlertDialog>
                      <AlertDialogTrigger
                        className={
                          ts?.status == 1
                            ? "text-left px-2 py-1.5 hover:bg-gray-100 text-sm w-full transition-colors rounded-sm"
                            : "hidden"
                        }
                      >
                        Share
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Share this test series with your students
                          </AlertDialogTitle>
                          <AlertDialogDescription className="flex">
                            <Input
                              type="text"
                              defaultValue={`https://testkart.in/test-series/${ts?.hash}`}
                              className="w-full p-2 rounded-r-none"
                              readOnly
                            />

                            <Button
                              className="rounded-s-none"
                              onClick={() =>
                                copyToClipboard(
                                  `https://testkart.in/test-series/${ts?.hash}`
                                )
                              }
                            >
                              Copy URL
                            </Button>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Close</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <AlertDialog>
                      <AlertDialogTrigger
                        className={
                          ts?.status == 0
                            ? "text-left px-2 py-1.5 text-sm text-red-600 hover:bg-red-200 w-full rounded-sm"
                            : "hidden"
                        }
                      >
                        Delete
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete this test series?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Deleting this test series will remove all the tests
                            and reports associated with it. This action cannot
                            be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Close</AlertDialogCancel>
                          <form
                            action={async () => {
                              await deleteTestSeries(ts?.test_series_id);
                            }}
                          >
                            <AlertDialogAction asChild>
                              <Button type="submit" variant={"destructive"}>
                                Yes, Delete
                              </Button>
                            </AlertDialogAction>
                          </form>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TSTable;
