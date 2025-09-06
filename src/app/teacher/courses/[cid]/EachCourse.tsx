"use client";

// import {
//   deleteContent,
//   toggleContentStatus,
//   updateContentOrder,
// } from "@/actions/content";
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
import {
  EllipsisVertical,
  Pencil,
  Eye,
  FileText,
  Video,
  Download,
  Clock,
  Users,
} from "lucide-react";

interface ContentData {
  content_id: number;
  course_id: number;
  title: string;
  description?: string;
  content_type: "video" | "document" | "quiz" | "assignment";
  duration?: number; // in minutes
  order_index: number;
  is_published: number;
  is_free: number;
  file_url?: string;
  thumbnail_url?: string;
  view_count?: number;
  completion_rate?: number;
  createdAt: string;
  updatedAt: string;
}

interface ContentMeta {
  total_duration: number;
  completion_count: number;
  enrolled_students: number;
  avg_rating: number | null;
}

interface Content {
  data: ContentData;
  meta: ContentMeta;
}

interface Course {
  course_id: number;
  title: string;
  description?: string;
}

const EachCourse = ({
  cid,
  course,
}: {
  cid: string;
  course: Course & { contents: any[] };
}) => {
  const [loading, setLoading] = useState(false);

  const renderContentTypeBadge = (type: string) => {
    const badges = {
      video: (
        <Badge className="bg-blue-100 text-blue-800">
          <Video size={12} className="mr-1" />
          Video
        </Badge>
      ),
      document: (
        <Badge className="bg-green-100 text-green-800">
          <FileText size={12} className="mr-1" />
          Document
        </Badge>
      ),
      quiz: <Badge className="bg-purple-100 text-purple-800">Quiz</Badge>,
      assignment: (
        <Badge className="bg-orange-100 text-orange-800">Assignment</Badge>
      ),
    };
    return badges[type as keyof typeof badges] || <Badge>{type}</Badge>;
  };

  const renderStatusBadge = (is_published: number) => {
    return is_published === 1 ? (
      <Badge variant="default">Published</Badge>
    ) : (
      <Badge variant="secondary">Draft</Badge>
    );
  };

  const handleFreeStatusChange = async (
    content_id: number,
    checked: boolean
  ) => {
    setLoading(true);
    // await toggleContentStatus(content_id, !checked, parseInt(cid));
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleOrderUpdate = async (content_id: number, new_order: number) => {
    setLoading(true);
    // await updateContentOrder(content_id, parseInt(cid), new_order);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatCompletionRate = (rate?: number) => {
    return rate ? `${Math.round(rate)}%` : "N/A";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] font-semibold">#</TableHead>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold text-center">Type</TableHead>
              <TableHead className="font-semibold text-center">
                Duration
              </TableHead>
              <TableHead className="font-semibold text-center">Views</TableHead>
              <TableHead className="font-semibold text-center">
                Completion
              </TableHead>
              <TableHead className="font-semibold text-center">Free?</TableHead>
              <TableHead className="font-semibold text-center">Order</TableHead>
              <TableHead className="font-semibold text-center">
                Status
              </TableHead>
              <TableHead className="font-semibold text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {course.contents?.map((content, index) => (
              <TableRow key={content.data.content_id}>
                <TableCell>{content.data.order_index || index + 1}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <Link
                      className="text-blue-600 hover:text-blue-700 underline underline-offset-4 font-medium"
                      href={`/teacher/courses/${cid}/content/${content.data.content_id}`}
                    >
                      {content.data.title}
                    </Link>
                    {content.data.description && (
                      <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                        {content.data.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {renderContentTypeBadge(content.data.content_type)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Clock size={12} />
                    {formatDuration(content.data.duration)}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Eye size={12} />
                    {content.data.view_count || 0}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {formatCompletionRate(content.data.completion_rate)}
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    checked={content.data.is_free === 1}
                    onCheckedChange={async (checked) =>
                      handleFreeStatusChange(
                        content.data.content_id,
                        Boolean(checked)
                      )
                    }
                    disabled={loading}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Pencil size={12} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48">
                      <form
                        className="space-y-3"
                        action={async (formData) => {
                          const { new_order } = Object.fromEntries(
                            formData
                          ) as {
                            new_order: string;
                          };
                          await handleOrderUpdate(
                            content.data.content_id,
                            parseInt(new_order)
                          );
                        }}
                      >
                        <div>
                          <label className="text-sm font-medium">
                            Order Position
                          </label>
                          <Input
                            type="number"
                            name="new_order"
                            defaultValue={content.data.order_index}
                            min={1}
                            max={course.contents?.length || 1}
                            disabled={loading}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex justify-end">
                          <Close asChild>
                            <Button type="submit" size="sm">
                              Update
                            </Button>
                          </Close>
                        </div>
                      </form>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell className="text-center">
                  {renderStatusBadge(content.data.is_published)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-0 m-0">
                        <EllipsisVertical size={20} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Link
                          href={`/teacher/courses/${cid}/content/${content.data.content_id}`}
                          className="flex items-center gap-2"
                        >
                          <Eye size={16} />
                          View/Edit Content
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <Link
                          href={`/teacher/courses/${cid}/content/${content.data.content_id}/analytics`}
                          className="flex items-center gap-2"
                        >
                          Analytics
                        </Link>
                      </DropdownMenuItem>

                      {content.data.file_url && (
                        <DropdownMenuItem>
                          <a
                            href={content.data.file_url}
                            download
                            className="flex items-center gap-2"
                          >
                            <Download size={16} />
                            Download File
                          </a>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <AlertDialog>
                          <AlertDialogTrigger className="text-left px-2 py-1.5 text-sm text-red-600 hover:bg-red-200 w-full rounded-sm">
                            Delete Content
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to delete this content?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Deleting this content will remove it permanently
                                from the course. Student progress and analytics
                                data will also be lost. This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <form
                                action={async () => {
                                  //   await deleteContent(
                                  //     content.data.content_id,
                                  //     parseInt(cid)
                                  //   );
                                }}
                              >
                                <AlertDialogAction asChild>
                                  <Button type="submit" variant="destructive">
                                    Yes, Delete Content
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
            {!course.contents?.length && (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-8 text-gray-500"
                >
                  No content added yet.
                  <Link
                    href={`/teacher/courses/${cid}/create`}
                    className="text-blue-600 hover:text-blue-700 ml-1"
                  >
                    Add your first content
                  </Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EachCourse;
