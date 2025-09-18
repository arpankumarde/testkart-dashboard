"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BookOpen, Save, Upload } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Course } from "@/types/course";
import api from "@/lib/api";
import { Apiresponse } from "@/types/api";
import getTokenClient from "@/lib/getTokenClient";
import { toast } from "sonner";
import { Exam } from "@/types/exam";

interface UpdatePayload {
  title: string;
  description: string | null;
  exam_id: number | null;
  price: number;
  discount: number;
  original_price: number | null;
  is_published: boolean;
  // thumbnail?: string;
}

const CourseEditPage = () => {
  const { cid } = useParams<{ cid: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    exam_id: null as number | null,
    price: 0,
    discount: 0,
    original_price: null as number | null,
    is_published: false,
  });

  const isPaid =
    formData.price > 0 ||
    (formData.original_price && formData.original_price > 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingData(true);
        const token = getTokenClient();

        const courseResponse = await api.get<Apiresponse<{ course: Course }>>(
          `/api/v1/courses/${cid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const courseData = courseResponse.data?.data?.course;
        if (courseData) {
          setCourse(courseData);
          setFormData({
            title: courseData.title,
            description: courseData.description || "",
            exam_id: courseData.exam_id,
            price: courseData.price,
            discount: courseData.discount,
            original_price: courseData.original_price,
            is_published: courseData.is_published,
          });
        }

        const examsResponse = await api.get<Apiresponse<Exam[]>>(
          `/api/v1/exams/parsed`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setExams(examsResponse.data?.data || []);
      } catch (err) {
        console.error("Error fetching course data:", err);
        setError("Failed to load course data");
      } finally {
        setFetchingData(false);
      }
    };

    if (cid) {
      fetchData();
    }
  }, [cid]);

  useEffect(() => {
    if (isPaid && formData.original_price !== null && formData.price > 0) {
      const calculatedDiscount = Math.max(
        0,
        formData.original_price - formData.price
      );
      setFormData((prev) => ({
        ...prev,
        discount: calculatedDiscount,
      }));
    }
  }, [formData.original_price, formData.price, isPaid]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExamChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      exam_id: value ? parseInt(value) : null,
    }));
  };

  const handlePricingTypeChange = (value: string) => {
    const isNowPaid = value === "paid";
    if (!isNowPaid) {
      setFormData((prev) => ({
        ...prev,
        price: 0,
        discount: 0,
        original_price: null,
      }));
    } else if (course && !isPaid) {
      setFormData((prev) => ({
        ...prev,
        price: 100,
        original_price: 100,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = getTokenClient();

      const payload: UpdatePayload = {
        title: formData.title.trim(),
        description: formData.description || null,
        exam_id: formData.exam_id,
        price: isPaid ? formData.price : 0,
        discount: isPaid ? formData.discount : 0,
        original_price: isPaid ? formData.original_price : null,
        is_published: formData.is_published,
      };

      const response = await api.patch<Apiresponse<{ course: Course }>>(
        `/api/v1/courses/${cid}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Course updated successfully!");
        const updatedCourse = response.data.data?.course;
        if (updatedCourse) {
          setCourse(updatedCourse);
        }
      } else {
        toast.error(response.data.message || "Failed to update course");
        setError(response.data.message || "Failed to update course");
      }
    } catch (err) {
      console.error("Error updating course:", err);
      toast.error("An error occurred while updating the course");
      setError("An error occurred while updating the course");
    } finally {
      setLoading(false);
    }
  };

  // const handleThumbnailUpload = async (file: File) => {
  // };

  if (fetchingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Course</h1>
        <p className="text-muted-foreground">
          Update your course information and settings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Course Details */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-l-4 border-l-primary pt-0">
              <CardHeader className="bg-primary/5 py-4">
                <CardTitle className="text-primary">Course Details</CardTitle>
                <CardDescription>
                  Update the basic information for your course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    maxLength={100}
                    className="w-full"
                    placeholder="Enter course title"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Title must be 100 characters or less.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    cols={2}
                    rows={8}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="h-[10rem] w-full resize-none"
                    placeholder="Enter course description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="is_published">Publication Status</Label>
                  <RadioGroup
                    value={formData.is_published ? "published" : "draft"}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_published: value === "published",
                      }))
                    }
                    className="flex flex-row space-y-1"
                  >
                    <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 h-full">
                      <RadioGroupItem id="status-draft" value="draft" />
                      <Label
                        htmlFor="status-draft"
                        className="flex-1 cursor-pointer"
                      >
                        Draft
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 h-full">
                      <RadioGroupItem id="status-published" value="published" />
                      <Label
                        htmlFor="status-published"
                        className="flex-1 cursor-pointer"
                      >
                        Published
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Future thumbnail upload section */}
            {/* <Card className="border-l-4 border-l-primary pt-0">
              <CardHeader className="bg-primary/5 py-4">
                <CardTitle className="text-primary">Course Thumbnail</CardTitle>
                <CardDescription>
                  Upload or update course thumbnail image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Thumbnail</Label>
                  {course?.thumbnail ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                      <img
                        src={course.thumbnail}
                        alt="Course thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                      <p className="text-muted-foreground">No thumbnail uploaded</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Upload New Thumbnail</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      disabled
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" disabled>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Thumbnail upload feature coming soon.
                  </p>
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Right Column - Exam Selection & Pricing */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-l-4 border-l-primary pt-0">
              <CardHeader className="bg-primary/5 py-4">
                <CardTitle className="flex items-center text-primary">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Exam Information
                </CardTitle>
                <CardDescription>
                  Update exam selection for this course (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exam">Select an exam</Label>
                  <Select
                    name="exam"
                    value={formData.exam_id?.toString() || ""}
                    onValueChange={handleExamChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an exam (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Exams</SelectLabel>
                        {exams.map((exam) => (
                          <SelectItem
                            key={exam.exam_id}
                            value={exam.exam_id.toString()}
                          >
                            {exam.exam}
                          </SelectItem>
                        ))}
                        {exams.length === 0 && (
                          <SelectItem value="no-exams" disabled>
                            No exams available
                          </SelectItem>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {formData.exam_id && course?.exam_id !== formData.exam_id && (
                    <p className="text-xs text-amber-600">
                      Changing exam may affect existing course content.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary pt-0">
              <CardHeader className="bg-primary/5 py-4">
                <CardTitle className="text-primary">Pricing</CardTitle>
                <CardDescription>
                  Update pricing for your course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="pricing">Pricing Type</Label>
                  <RadioGroup
                    value={isPaid ? "paid" : "free"}
                    onValueChange={handlePricingTypeChange}
                    className="flex flex-row space-y-1"
                  >
                    <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 h-full">
                      <RadioGroupItem id="pricing-free" value="free" />
                      <Label
                        htmlFor="pricing-free"
                        className="flex-1 cursor-pointer"
                      >
                        Free
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 h-full">
                      <RadioGroupItem id="pricing-paid" value="paid" />
                      <Label
                        htmlFor="pricing-paid"
                        className="flex-1 cursor-pointer"
                      >
                        Paid
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {isPaid && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="original_price">Original Price</Label>
                      <Input
                        id="original_price"
                        name="original_price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.original_price || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            original_price: e.target.value
                              ? Number(e.target.value)
                              : null,
                          }))
                        }
                        className="w-full"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Final Price</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            price: Number(e.target.value),
                          }))
                        }
                        className="w-full"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount">Discount Amount</Label>
                      <Input
                        id="discount"
                        name="discount"
                        type="number"
                        value={formData.discount}
                        className="w-full bg-gray-200 cursor-not-allowed"
                        readOnly
                      />
                    </div>
                  </div>
                )}

                {isPaid &&
                  formData.original_price !== null &&
                  formData.price > 0 && (
                    <div className="pt-4">
                      <Card className="border border-dashed">
                        <CardHeader>
                          <CardTitle className="text-sm">
                            Pricing Preview
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm">Original Price</p>
                              <p className="text-lg font-bold">
                                ₹{formData.original_price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-2xl">→</div>
                            <div>
                              <p className="text-sm">Final Price</p>
                              <p className="text-lg font-bold text-green-600">
                                ₹{formData.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-2xl">=</div>
                            <div>
                              <p className="text-sm">You Save</p>
                              <p className="text-lg font-bold text-green-600">
                                ₹{formData.discount.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    "Updating..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Course
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default CourseEditPage;
