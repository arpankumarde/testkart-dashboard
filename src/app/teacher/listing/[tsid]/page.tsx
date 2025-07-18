"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  BookOpen,
  Users,
  Star,
  AlertCircle,
  CheckCircle,
  IndianRupee,
} from "lucide-react";
import getTokenClient from "@/lib/getTokenClient";
import api from "@/lib/api";
import { toast } from "sonner";

interface ApiResponse {
  success: boolean;
  data: TestSeries;
}

interface TestSeries {
  test_series_id: number;
  exam_id: number;
  academy_id: number;
  title: string;
  language: string;
  hash: string;
  description: string;
  cover_photo: string;
  total_tests: number;
  free_tests: number;
  price: number;
  price_before_discount: number;
  discount: number;
  discountType: string;
  is_paid: number;
  status: number;
  difficulty_level: string;
  is_purchased: number;
  is_deleted: number;
  createdAt: string;
  updatedAt: string;
  exam: Exam;
}

interface Exam {
  exam_id: number;
  exam: string;
  slug: string;
  category: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

interface ListingApiResponse {
  success: boolean;
  messge?: string | null;
  data?: {};
}

interface ApiResponse2 {
  success: boolean;
  error?: string | null;
  message?: string | null;
  data?: { test_series: TestSeries[] } | {};
}

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const tsId = params.tsid as string;
  const sParams = useSearchParams();
  const [publish, setPublish] = useState(
    Boolean(sParams.get("publish")) || false
  );
  const [testSeries, setTestSeries] = useState<TestSeries>();
  const [vDetails, setVDetails] = useState<ApiResponse2>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setPublish(Boolean(sParams.get("publish")) || false);
  }, [sParams.get("publish")]);

  const fetchTSDetails = async () => {
    const response = await api.get<ApiResponse>(`/api/v1/test-series/${tsId}`, {
      headers: {
        Authorization: `Bearer ${getTokenClient()}`,
      },
    });
    return response.data;
  };

  const verifyTS = async () => {
    const response = await api.get<ApiResponse2>(
      `/api/v1/test-series/${tsId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${getTokenClient()}`,
        },
      }
    );
    return response.data;
  };

  const handlePublish = async () => {
    const response = await api.post<ListingApiResponse>(
      `/api/v1/test-series/${tsId}/publish`,
      {
        free_tests: testSeries?.free_tests || 0,
      },
      {
        headers: {
          Authorization: `Bearer ${getTokenClient()}`,
        },
      }
    );

    if (response?.data?.success === true) {
      toast.success("Test Series published successfully!");
      router.push("/teacher/test-series");
    }
  };

  const handleUnlist = async () => {
    const response = await api.get<ListingApiResponse>(
      `/api/v1/test-series/${tsId}/unlist`,
      {
        headers: {
          Authorization: `Bearer ${getTokenClient()}`,
        },
      }
    );

    if (response?.data?.success === true) {
      toast.success("Test Series unlisted!");
      router.push("/teacher/test-series");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [tsDetails, vDetails] = await Promise.all([
          fetchTSDetails(),
          verifyTS(),
        ]);

        setTestSeries(tsDetails.data);
        setVDetails(vDetails);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tsId]);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="secondary">Draft</Badge>;
      case 1:
        return <Badge variant="default">Live</Badge>;
      case 2:
        return <Badge variant="destructive">Unlisted</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const renderActionButtons = () => {
    if (vDetails?.success === true) {
      const status = testSeries?.status;

      if (status === 0 || status === 2) {
        return (
          <div className="space-y-4">
            {vDetails.message && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{vDetails.message}</AlertDescription>
              </Alert>
            )}
            <Button onClick={handlePublish} className="w-full">
              Publish Test Series
            </Button>
          </div>
        );
      } else if (status === 1) {
        return (
          <div className="space-y-4">
            {vDetails.message && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{vDetails.message}</AlertDescription>
              </Alert>
            )}
            <Button
              onClick={handleUnlist}
              variant="destructive"
              className="w-full"
            >
              Unlist Test Series
            </Button>
          </div>
        );
      } else {
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Invalid test series status. Please contact support.
            </AlertDescription>
          </Alert>
        );
      }
    } else {
      // Show error field
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {vDetails?.error ||
              "Verification failed. Please check the test series details."}
          </AlertDescription>
        </Alert>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="space-y-6 lg:col-span-7">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {testSeries?.title}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {testSeries?.exam?.exam}
                  </CardDescription>
                </div>
                {testSeries?.status !== undefined &&
                  getStatusBadge(testSeries.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{testSeries?.description}</p>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Total Tests</p>
                    <p className="text-2xl font-bold">
                      {testSeries?.total_tests}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Free Tests</p>
                    <p className="text-2xl font-bold">
                      {testSeries?.free_tests}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <IndianRupee className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Price</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xl font-bold">
                        {formatPrice(testSeries?.price || 0)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">Difficulty</p>
                    <p className="text-lg font-semibold capitalize">
                      {testSeries?.difficulty_level}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Language:</span>
                  <Badge variant="outline">{testSeries?.language}</Badge>
                </div>
                {typeof testSeries?.discount === "number" &&
                  testSeries.discount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Discount:</span>
                      <Badge variant="destructive">
                        {testSeries.discount}% OFF
                      </Badge>
                    </div>
                  )}
              </div>

              <Separator />

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Created: {formatDate(testSeries?.createdAt || "")}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Updated: {formatDate(testSeries?.updatedAt || "")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Publishing Actions</CardTitle>
              <CardDescription>
                Manage the listing status of your test series
              </CardDescription>
            </CardHeader>
            <CardContent>{renderActionButtons()}</CardContent>
          </Card>

          {/* Debug Info */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-sm">Debug Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div>Publish Parameter: {publish.toString()}</div>
              <div>Test Series ID: {tsId}</div>
              <div>Verification Success: {vDetails?.success?.toString()}</div>
              <div>Test Series Status: {testSeries?.status}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
