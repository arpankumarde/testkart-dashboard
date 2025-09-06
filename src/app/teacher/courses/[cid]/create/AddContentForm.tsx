"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import getTokenClient from "@/lib/getTokenClient";
import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Video,
  FileText,
  Upload,
  Clock,
  ArrowLeft,
  Loader2,
  Link as LinkIcon,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface FormData {
  title: string;
  description: string;
  content_type: string;
  video_url: string;
  pdf_url: string;
  duration_minutes: number;
  order_index: number;
  is_free_preview: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
  content_type?: string;
  video_url?: string;
  pdf_url?: string;
  duration_minutes?: string;
  order_index?: string;
}

interface AddContentFormProps {
  data: Course;
  existingContentCount?: number;
}

const AddContentForm = ({
  data,
  existingContentCount = 0,
}: AddContentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    content_type: "video",
    video_url: "",
    pdf_url: "",
    duration_minutes: 0,
    order_index: existingContentCount + 1,
    is_free_preview: false,
  });

  // Validation functions
  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Optional field
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    // Content type validation
    if (!formData.content_type) {
      newErrors.content_type = "Content type is required";
    }

    // URL validations
    if (formData.video_url && !validateUrl(formData.video_url)) {
      newErrors.video_url = "Please enter a valid URL";
    }

    if (formData.pdf_url && !validateUrl(formData.pdf_url)) {
      newErrors.pdf_url = "Please enter a valid URL";
    }

    // Duration validation
    if (formData.duration_minutes < 0) {
      newErrors.duration_minutes = "Duration must be positive";
    } else if (formData.duration_minutes > 1440) {
      newErrors.duration_minutes = "Duration cannot exceed 24 hours";
    }

    // Order validation
    if (formData.order_index < 1) {
      newErrors.order_index = "Order must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert minutes to seconds for API
      const payload = {
        course_id: data?.id,
        title: formData.title.trim(),
        description: formData.description.trim() || "",
        video_url: formData.video_url || undefined,
        pdf_url: formData.pdf_url || undefined,
        duration_seconds: formData.duration_minutes * 60,
        order_index: formData.order_index,
        is_free_preview: formData.is_free_preview,
      };

      const response = await api.post("/api/v1/contents", payload, {
        headers: {
          Authorization: `Bearer ${getTokenClient()}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/teacher/courses/${data.id}`);
        }, 2000);
      }
    } catch (err: any) {
      console.error("Error creating content:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to create content. Please try again."
      );
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create content. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getContentTypeIcon = (type: string) => {
    const icons = {
      video: <Video className="h-4 w-4" />,
      document: <FileText className="h-4 w-4" />,
      quiz: <FileText className="h-4 w-4" />,
      assignment: <FileText className="h-4 w-4" />,
    };
    return (
      icons[type as keyof typeof icons] || <FileText className="h-4 w-4" />
    );
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-900">
                Content Created Successfully!
              </h3>
              <p className="text-gray-600">
                Redirecting you back to the course...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-l-4 border-l-primary pt-0">
              <CardHeader className="bg-primary/5 py-4">
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details for your content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter content title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter content description (optional)"
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className={errors.description ? "border-red-500" : ""}
                  />
                  <p className="text-sm text-gray-500">
                    Brief description of what students will learn
                  </p>
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content_type">Content Type *</Label>
                  <Select
                    value={formData.content_type}
                    onValueChange={(value) =>
                      handleInputChange("content_type", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.content_type ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          Video Lesson
                        </div>
                      </SelectItem>
                      <SelectItem value="document">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Document/PDF
                        </div>
                      </SelectItem>
                      <SelectItem value="quiz">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Quiz
                        </div>
                      </SelectItem>
                      <SelectItem value="assignment">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Assignment
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.content_type && (
                    <p className="text-sm text-red-600">
                      {errors.content_type}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary pt-0">
              <CardHeader className="bg-primary/5 py-4">
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Content URLs
                </CardTitle>
                <CardDescription>
                  Add links to your video and document resources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input
                    id="video_url"
                    type="url"
                    placeholder="https://example.com/video.mp4"
                    value={formData.video_url}
                    onChange={(e) =>
                      handleInputChange("video_url", e.target.value)
                    }
                    className={errors.video_url ? "border-red-500" : ""}
                  />
                  <p className="text-sm text-gray-500">
                    Direct link to video file or streaming URL
                  </p>
                  {errors.video_url && (
                    <p className="text-sm text-red-600">{errors.video_url}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pdf_url">PDF/Document URL</Label>
                  <Input
                    id="pdf_url"
                    type="url"
                    placeholder="https://example.com/document.pdf"
                    value={formData.pdf_url}
                    onChange={(e) =>
                      handleInputChange("pdf_url", e.target.value)
                    }
                    className={errors.pdf_url ? "border-red-500" : ""}
                  />
                  <p className="text-sm text-gray-500">
                    Direct link to PDF or document file
                  </p>
                  {errors.pdf_url && (
                    <p className="text-sm text-red-600">{errors.pdf_url}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-l-4 border-l-primary pt-0">
              <CardHeader className="bg-primary/5 py-4">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Duration & Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="duration_minutes">Duration (minutes) *</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    min="0"
                    max="1440"
                    placeholder="60"
                    value={formData.duration_minutes || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "duration_minutes",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className={errors.duration_minutes ? "border-red-500" : ""}
                  />
                  {formData.duration_minutes > 0 && (
                    <p className="text-sm font-medium text-gray-600">
                      {formatDuration(formData.duration_minutes)}
                    </p>
                  )}
                  {errors.duration_minutes && (
                    <p className="text-sm text-red-600">
                      {errors.duration_minutes}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order_index">Position in Course *</Label>
                  <Input
                    id="order_index"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formData.order_index || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "order_index",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className={errors.order_index ? "border-red-500" : ""}
                  />
                  <p className="text-sm text-gray-500">
                    Order in which this content appears
                  </p>
                  {errors.order_index && (
                    <p className="text-sm text-red-600">{errors.order_index}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary pt-0">
              <CardHeader className="bg-primary/5 py-4">
                <CardTitle>Access Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="is_free_preview"
                    checked={formData.is_free_preview}
                    onCheckedChange={(checked) =>
                      handleInputChange("is_free_preview", checked)
                    }
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="is_free_preview">Free Preview</Label>
                    <p className="text-sm text-gray-500">
                      Allow non-enrolled students to access this content for
                      free
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary pt-0">
              <CardHeader className="bg-primary/5 py-4">
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  {getContentTypeIcon(formData.content_type)}
                  <span className="capitalize">{formData.content_type}</span>
                </div>

                {formData.title && (
                  <div>
                    <p className="font-medium truncate">{formData.title}</p>
                  </div>
                )}

                {formData.duration_minutes > 0 && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    {formatDuration(formData.duration_minutes)}
                  </div>
                )}

                {formData.is_free_preview && (
                  <div className="inline-block">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Free Preview
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Creating..." : "Create Content"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddContentForm;
