"use client";

import {
  deleteTest,
  scheduleTest,
  toggleFreeStatus,
  unscheduleTest,
} from "@/actions/test";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { useState } from "react";
import { Close } from "@radix-ui/react-popover";
import { Input } from "@/components/ui/input";
import { EllipsisVertical, Pencil } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  console.log(data);

  const renderStatusBadge = (meta: TestMeta) => {
    switch (meta.questions_count >= meta.total_questions) {
      case true:
        return <Badge>Complete</Badge>;
      case false:
        return <Badge variant={"destructive"}>Incomplete</Badge>;
    }
  };

  const handleFreeChange = async (test_id: number, checked: boolean) => {
    setLoading(true);
    await toggleFreeStatus(test_id, !checked, data[0]?.data?.test_series_id);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleSchedule = async (test_id: number, scheduled_on: string) => {
    setLoading(true);
    await scheduleTest(test_id, data[0]?.data?.test_series_id, scheduled_on);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleUnschedule = async (test_id: number) => {
    setLoading(true);
    await unscheduleTest(test_id, data[0]?.data?.test_series_id);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px] font-bold">#</TableHead>
          <TableHead className="font-bold text-xl">Test Name</TableHead>
          <TableHead className="font-bold text-xl">Subjects</TableHead>
          <TableHead className="font-bold text-xl text-center">
            Metadata
          </TableHead>
          <TableHead className="font-bold text-xl text-center">Free?</TableHead>
          <TableHead className="font-bold text-xl text-center">
            Schedule
          </TableHead>
          <TableHead className="font-bold text-xl">Status</TableHead>
          <TableHead className="font-bold text-xl">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((ts, id) => (
          <TableRow key={ts?.data?.test_id}>
            <TableCell>{id + 1}</TableCell>
            <TableCell>
              <Link
                className="text-blue-600 hover:text-blue-700 underline underline-offset-4"
                href={`/teacher/test-series/${ts?.data?.test_series_id}/${ts?.data?.test_id}`}
              >
                {ts?.data?.title}
              </Link>
            </TableCell>
            <TableCell className="text-xs">{ts?.meta?.subjects}</TableCell>
            <TableCell className="text-center">
              {ts?.meta?.questions_count ?? 0}/{ts?.meta?.total_questions ?? 0}{" "}
              Qs
              <br />
              {ts?.data?.duration} mins
            </TableCell>
            <TableCell className="text-center">
              <Checkbox
                checked={ts?.data?.is_paid !== 1}
                onCheckedChange={async (checked) =>
                  handleFreeChange(ts?.data?.test_id, Boolean(checked))
                }
                disabled={loading}
              />
            </TableCell>
            <TableCell className="flex flex-col items-center justify-center">
              {ts?.data?.is_scheduled ? (
                <>
                  {new Date(ts?.data?.scheduled_on ?? "").toLocaleString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }
                  )}
                  <br />
                  <span className="flex ">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="secondary" size="sm">
                          <Pencil />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-72">
                        <form
                          className="space-y-3"
                          action={async (formData) => {
                            const { scheduled_on } = Object.fromEntries(
                              formData
                            ) as {
                              scheduled_on: string;
                            };

                            const isoString = new Date(
                              scheduled_on
                            ).toISOString();

                            await handleSchedule(ts?.data?.test_id, isoString);
                            console.log(isoString);
                          }}
                        >
                          <Input
                            type="datetime-local"
                            name="scheduled_on"
                            defaultValue={
                              ts?.data?.is_scheduled
                                ? new Date(ts?.data?.scheduled_on ?? "")
                                    .toISOString()
                                    .slice(0, 16)
                                : ""
                            }
                            min={new Date().toISOString().slice(0, 16)}
                            disabled={loading}
                          />
                          <div className="flex flex-col sm:flex-row sm:justify-end">
                            <Close asChild>
                              <Button type="submit" size="sm">
                                Save
                              </Button>
                            </Close>
                          </div>
                        </form>
                      </PopoverContent>
                    </Popover>
                    <Button
                      variant={"secondary"}
                      onClick={() => handleUnschedule(ts?.data?.test_id)}
                      className="px-3 py-1.5"
                      size="sm"
                    >
                      Unschedule
                    </Button>
                  </span>
                </>
              ) : (
                <>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="secondary" size="sm">
                        Schedule
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72">
                      <form
                        className="space-y-3"
                        action={async (formData) => {
                          const { scheduled_on } = Object.fromEntries(
                            formData
                          ) as {
                            scheduled_on: string;
                          };

                          const isoString = new Date(
                            scheduled_on
                          ).toISOString();

                          await handleSchedule(
                            ts?.data?.test_id,
                            isoString.slice(0, 16)
                          );
                          console.log(isoString.slice(0, 16));
                        }}
                      >
                        <Input
                          type="datetime-local"
                          name="scheduled_on"
                          defaultValue={
                            ts?.data?.is_scheduled
                              ? new Date(ts?.data?.is_scheduled)
                                  .toISOString()
                                  .slice(0, 16)
                              : ""
                          }
                          disabled={loading}
                        />
                        <div className="flex flex-col sm:flex-row sm:justify-end">
                          <Close asChild>
                            <Button type="submit" size="sm">
                              Save
                            </Button>
                          </Close>
                        </div>
                      </form>
                    </PopoverContent>
                  </Popover>
                </>
              )}
            </TableCell>
            <TableCell className="text-center">
              {renderStatusBadge(ts?.meta)}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} className="p-0 m-0">
                    <EllipsisVertical size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link
                      href={`/teacher/test-series/${ts?.data?.test_series_id}/${ts?.data?.test_id}`}
                    >
                      View Questions
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href={`/teacher/reports/${ts?.data?.test_series_id}/${ts?.data?.test_id}`}
                    >
                      View Reports
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <AlertDialog>
                      <AlertDialogTrigger
                        className={
                          ts?.data?.status == 0
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
                              await deleteTest(
                                ts?.data?.test_id,
                                ts?.data?.test_series_id
                              );
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

export default TTable;
