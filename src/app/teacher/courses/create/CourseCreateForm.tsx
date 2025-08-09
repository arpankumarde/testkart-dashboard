"use client";

import { useState, useEffect } from "react";
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
import { BookOpen, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import getTokenClient from "@/lib/getTokenClient";
import { toast } from "sonner";
import { Course } from "@/types/course";

interface Subject {
  subject_id: number;
  subject: string;
}

interface DefaultPattern {
  subjects: Subject[];
  positive_marks: number;
  negative_marks: number;
  exam_duration: number;
}

interface ExamData {
  exam_id: number;
  exam: string;
  slug: string;
  category: string;
  status: number;
  default_pattern: DefaultPattern;
  created_at: string;
  updated_at: string;
}

interface CourseCreateFormProps {
  exams?: ExamData[];
}

interface Payload {
  title: string;
  description: string;
  module_based: boolean;
  exam_id: number | null;
  price: number;
  discount: number;
  discount_type: string | null;
  original_price: number | null;
}

interface Response {
  success: boolean;
  data?: {
    course?: Course;
  };
  message?: string;
  error?: string;
}

const CourseCreateForm = ({ exams = [] }: CourseCreateFormProps) => {
  const router = useRouter();
  const [isModuleBased, setIsModuleBased] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    exam_id: null as number | null,
    price: 0,
    discount: 0,
    original_price: null as number | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = getTokenClient();

      const payload: Payload = {
        title: formData.title.trim(),
        description: formData.description,
        module_based: isModuleBased,
        exam_id: formData.exam_id,
        price: isPaid ? formData.price : 0,
        discount: isPaid ? formData.discount : 0,
        discount_type: isPaid ? "flat" : null,
        original_price: isPaid ? formData.original_price : null,
      };

      const response = await api.post<Response>("/api/v1/courses", payload, {
        headers: {
          user_type: "TEACHER",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        router.push(`/teacher/courses/${response?.data?.data?.course?.id}`);
      } else {
        toast.error(response.data.message || "Failed to create course");
        setError(response.data.message || "Failed to create course");
      }
    } catch (err) {
      console.error("Error creating course:", err);
      setError("An error occurred while creating the course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Course Details */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-l-4 border-l-primary pt-0">
            <CardHeader className="bg-primary/5 py-4">
              <CardTitle className="text-primary">Course Details</CardTitle>
              <CardDescription>
                Enter the basic information for your course
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
            </CardContent>
          </Card>
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
                Select an exam for this course (optional)
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
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary pt-0">
            <CardHeader className="bg-primary/5 py-4">
              <CardTitle className="text-primary">Pricing</CardTitle>
              <CardDescription>Set pricing for your course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="pricing">Pricing Type</Label>
                <RadioGroup
                  value={isPaid ? "paid" : "free"}
                  onValueChange={(value) => setIsPaid(value === "paid")}
                  className="flex flex-row space-y-1"
                  defaultValue="free"
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          discount: Number(e.target.value),
                        }))
                      }
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
                  "Creating..."
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Course
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
  );
};

export default CourseCreateForm;
