"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { languages } from "@/constants/languages.json";
import { difficulty } from "@/constants/difficulty.json";
import { editTestSeries } from "@/actions/test-series";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { AuthResponse } from "@/actions/auth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

interface Subject {
  subject_id: number;
  subject: string;
  questions: number;
}

interface DefaultPattern {
  subjects: Subject[];
  positive_marks: number;
  negative_marks: number;
  exam_duration: number;
}

interface Exam {
  exam_id: number;
  exam: string;
  slug: string;
  category: number;
  status: number;
  default_pattern: DefaultPattern;
  createdAt: string;
  updatedAt: string;
}

interface TSEditFormProps {
  data: TestSeries;
}

interface Payload {
  title: string;
  description: string;
  language: string;
  exam_id: number;
  academy_id: number;
  difficulty_level: string;
  is_paid: number;
  price_before_discount: number;
  discount: number;
  price: number;
  discountType: string;
}

const TSEditForm = ({ data, tsid }: TSEditFormProps & { tsid: string }) => {
  const router = useRouter();
  const [isPaid, setIsPaid] = useState(data?.is_paid);
  const [price, setPrice] = useState(data?.price);
  const [priceBeforeDiscount, setPriceBeforeDiscount] = useState(
    data?.price_before_discount
  );
  const userCookie = getCookie("tkuser");
  const academyId = userCookie
    ? (JSON.parse(userCookie) as AuthResponse["data"])?.user?.academy
        ?.academy_id
    : 1;

  return (
    <form
      className="space-y-6"
      action={async (e) => {
        console.log(e);
        const formData = Object.fromEntries(e.entries());

        const payload: Payload = {
          title: (formData["title"] as string).trim(),
          description: formData["description"] as string,
          language: formData["language"] as string,
          academy_id: academyId,
          exam_id: data?.exam_id,
          difficulty_level: formData["difficulty"] as string,
          is_paid: isPaid ? 1 : 0,
          price_before_discount: priceBeforeDiscount,
          discount: priceBeforeDiscount - price,
          price: price,
          discountType: "flat",
        };

        const response = await editTestSeries(payload, Number(tsid));

        if (response?.success) {
          router.push(`/teacher/test-series`);
        }
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-l-4 border-l-primary pt-0">
            <CardHeader className="bg-primary/5 py-4">
              <CardTitle className="text-primary">Basic Information</CardTitle>
              <CardDescription>
                Update the core details of your test series
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  maxLength={100}
                  defaultValue={data?.title}
                  className="w-full"
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
                  defaultValue={data?.description}
                  rows={5}
                  className="w-full resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    name="difficulty"
                    required
                    defaultValue={data?.difficulty_level}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulty.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    name="language"
                    required
                    defaultValue={data?.language}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary pt-0">
            <CardHeader className="bg-primary/5 py-4">
              <CardTitle className="text-primary">Pricing</CardTitle>
              <CardDescription>Set your pricing strategy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <RadioGroup
                  name="pricing"
                  onValueChange={(value) => setIsPaid(value === "paid" ? 1 : 0)}
                  required
                  defaultValue={data?.is_paid ? "paid" : "free"}
                  className="flex flex-col md:flex-row gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-md px-4 py-3 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem id="pricing-free" value="free" />
                    <Label htmlFor="pricing-free" className="cursor-pointer">
                      Free
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md px-4 py-3 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem id="pricing-paid" value="paid" />
                    <Label htmlFor="pricing-paid" className="cursor-pointer">
                      Paid
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {isPaid ? (
                <div className="mt-4 space-y-4 p-4 bg-primary/5 rounded-md border border-primary/20">
                  <h4 className="text-sm font-medium text-primary">
                    Pricing Details
                  </h4>
                  <Separator className="bg-primary/10" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price_before_discount">
                        Original Price (₹)
                      </Label>
                      <Input
                        id="price_before_discount"
                        name="price_before_discount"
                        type="number"
                        value={priceBeforeDiscount}
                        onChange={(e) =>
                          setPriceBeforeDiscount(Number(e.target.value))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Discount (₹)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="final_price">Final Price (₹)</Label>
                      <div className="relative">
                        <Input
                          id="final_price"
                          name="final_price"
                          type="number"
                          value={priceBeforeDiscount - price}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Cover Image */}
        <div className="lg:col-span-1">
          <Card className="border-l-4 border-l-primary pt-0">
            <CardHeader className="bg-primary/5 py-4">
              <CardTitle className="text-primary">Cover Image</CardTitle>
              <CardDescription>Preview your test series cover</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              {data?.cover_photo ? (
                <div className="aspect-video w-full relative rounded-md overflow-hidden border">
                  <img
                    src={data.cover_photo}
                    alt={data.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-muted flex flex-col items-center justify-center rounded-md border">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">
                    No cover image
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="text-sm text-muted-foreground space-y-2 w-full">
                <h4 className="font-medium">Test Series Details:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span>Exam:</span>
                  <span className="font-medium">{data?.exam?.exam}</span>

                  <span>Total Tests:</span>
                  <span className="font-medium">{data?.total_tests}</span>

                  <span>Free Tests:</span>
                  <span className="font-medium">{data?.free_tests}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="px-8 font-medium bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Update Test Series
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default TSEditForm;
