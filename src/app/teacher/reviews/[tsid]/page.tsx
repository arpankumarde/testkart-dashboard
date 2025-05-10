"use client";

import { useState } from "react";
import api from "@/lib/api";
import getTokenClient from "@/lib/getTokenClient";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import LoaderComponent from "@/components/blocks/LoaderComponent";
import { FaStar } from "react-icons/fa";

enum USERTYPE {
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
}

interface Replier {
  id: number;
  name: string;
  avatar: string;
}

interface Reply {
  reply_id: number;
  reply: string;
  replier_type: USERTYPE;
  replier: Replier;
}

interface Reviewer {
  id: number;
  name: string;
  avatar: string;
}

interface Review {
  review_id: number;
  rating: number;
  review: string;
  reviewer_type: USERTYPE;
  reviewer: Reviewer;
  replies: Reply[];
  is_flagged?: boolean;
}

interface ReviewsResponse {
  reviews: Review[];
}

const Page = () => {
  const { tsid } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewToFlag, setReviewToFlag] = useState<number | null>(null);
  const [isFlagging, setIsFlagging] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get<ReviewsResponse>(
          `/api/v1/review/test-series-reviews/${tsid}`,
          {
            headers: {
              Authorization: `Bearer ${getTokenClient()}`,
            },
          }
        );

        console.log("Fetched reviews:", data.reviews);
        setReviews(data.reviews);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [tsid]);

  const handleFlagReview = async (reviewId: number, flag: boolean) => {
    setIsFlagging(true);
    try {
      await api.put(
        "/api/v1/review/flag-review",
        { review_id: reviewId, flag: Number(flag) },
        {
          headers: {
            Authorization: `Bearer ${getTokenClient()}`,
          },
        }
      );

      // Update the reviews state to reflect the change
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.review_id === reviewId
            ? { ...review, is_flagged: flag }
            : review
        )
      );
    } catch (error) {
      console.error("Error flagging review:", error);
      setError("Failed to flag review. Please try again later.");
    } finally {
      setIsFlagging(false);
      setReviewToFlag(null);
    }
  };

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Test Series Reviews</h1>
        <Badge variant="outline" className="px-3 py-1">
          {reviews.length} Reviews
        </Badge>
      </div>

      <Separator className="mb-6" />

      {reviews.length === 0 ? (
        <div className="text-center p-8 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            No reviews available for this test series.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.review_id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {review.reviewer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium">{review.reviewer.name}</h3>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-yellow-400 ${
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      {review.is_flagged ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setReviewToFlag(review.review_id)}
                        >
                          Unflag Review
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReviewToFlag(review.review_id)}
                        >
                          Flag Review
                        </Button>
                      )}
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {review.is_flagged ? "Unflag" : "Flag"} this review?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {review.is_flagged
                            ? "This will remove the flag from this review. Are you sure you want to continue?"
                            : "This will flag the review as inappropriate. Are you sure you want to continue?"}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleFlagReview(
                              review.review_id,
                              !review.is_flagged
                            )
                          }
                          disabled={isFlagging}
                        >
                          {isFlagging ? "Processing..." : "Confirm"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <p className="mt-4 text-gray-700">{review.review}</p>

                {review.replies.length > 0 && (
                  <div className="mt-6 pl-6 border-l-2 border-gray-200">
                    <h4 className="font-medium mb-3">
                      Replies ({review.replies.length})
                    </h4>
                    <div className="space-y-4">
                      {review.replies.slice(0, 2).map((reply) => (
                        <div
                          key={reply.reply_id}
                          className="bg-gray-50 p-3 rounded-md"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                              {reply.replier.name.charAt(0)}
                            </div>
                            <span className="font-medium text-sm">
                              {reply.replier.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {reply.replier_type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700">{reply.reply}</p>
                        </div>
                      ))}

                      {review.replies.length > 2 && (
                        <div className="mt-2">
                          <details className="group">
                            <summary className="cursor-pointer text-sm text-primary font-medium">
                              Show {review.replies.length - 2} more replies
                            </summary>
                            <div className="mt-3 space-y-4">
                              {review.replies.slice(2).map((reply) => (
                                <div
                                  key={reply.reply_id}
                                  className="bg-gray-50 p-3 rounded-md"
                                >
                                  <div className="flex items-center space-x-2 mb-2">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                      {reply.replier.name.charAt(0)}
                                    </div>
                                    <span className="font-medium text-sm">
                                      {reply.replier.name}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {reply.replier_type}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    {reply.reply}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
