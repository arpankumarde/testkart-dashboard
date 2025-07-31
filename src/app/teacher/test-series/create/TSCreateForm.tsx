"use client";

import { useState } from "react";
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
import { languages } from "@/constants/languages.json";
import { difficulty } from "@/constants/difficulty.json";
import { createTestSeries } from "@/actions/test-series";
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
import { BookOpen, PlusCircle } from "lucide-react";

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

interface TSCreateFormProps {
  data: ExamData[];
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

const TSCreateForm = ({ data }: TSCreateFormProps) => {
  const router = useRouter();
  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(0);
  const [priceBeforeDiscount, setPriceBeforeDiscount] = useState(0);
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
          exam_id: selectedExam?.exam_id ?? 0,
          academy_id: academyId,
          difficulty_level: formData["difficulty"] as string,
          is_paid: isPaid ? 1 : 0,
          price_before_discount: priceBeforeDiscount,
          discount: priceBeforeDiscount - price,
          price: price,
          discountType: "flat",
        };

        if (!selectedExam?.exam_id) {
          alert("Please select an exam");
          return;
        }

        const { data, success } = await createTestSeries(payload);
        if (success) {
          router.push(`/teacher/test-series/${data?.data?.test_series_id}`);
        }
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Exam Selection */}
        <div className="lg:col-span-1">
          <Card className="h-full border-l-4 border-l-primary pt-0">
            <CardHeader className="bg-primary/5 py-4">
              <CardTitle className="flex items-center text-primary">
                <BookOpen className="mr-2 h-5 w-5" />
                Exam Selection
              </CardTitle>
              <CardDescription>
                Choose the exam for your test series
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exam">Select an exam to proceed</Label>
                <Select
                  name="exam"
                  onValueChange={(value) => {
                    const exam = data?.find(
                      (exam) => exam.exam_id.toString() === value
                    );
                    setSelectedExam(exam || null);
                  }}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      new Map(data.map((exam) => [exam.category, exam])).keys()
                    ).map((category) => (
                      <SelectGroup key={category}>
                        <SelectLabel>{category}</SelectLabel>
                        {data
                          .filter((exam) => exam.category === category)
                          .map((exam) => (
                            <SelectItem
                              key={exam.exam_id}
                              value={exam.exam_id.toString()}
                            >
                              {exam.exam}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedExam && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Included Subjects:</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedExam.default_pattern.subjects.map((subject) => (
                      <span
                        key={subject.subject_id}
                        className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-md"
                      >
                        {subject.subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Test Series Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-l-4 border-l-primary pt-0">
            <CardHeader className="bg-primary/5 py-4">
              <CardTitle className="text-primary">
                Test Series Details
              </CardTitle>
              <CardDescription>
                Enter the basic information for your test series
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  maxLength={100}
                  className="w-full"
                  placeholder="Enter test series title"
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
                  rows={4}
                  className="w-full resize-none"
                  placeholder="Enter test series description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select name="difficulty" required>
                    <SelectTrigger className="w-full">
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
                  <Select name="language" required>
                    <SelectTrigger className="w-full">
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
              <CardTitle className="text-primary">Pricing Options</CardTitle>
              <CardDescription>
                Set pricing for your test series
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="pricing">Pricing Type</Label>
                <RadioGroup
                  name="pricing"
                  onValueChange={(value) => setIsPaid(value === "paid")}
                  required
                  className="flex flex-col space-y-1"
                  defaultValue="free"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                    <RadioGroupItem id="pricing-free" value="free" />
                    <Label
                      htmlFor="pricing-free"
                      className="flex-1 cursor-pointer"
                    >
                      Free
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
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
                    <Label htmlFor="price_before_discount">
                      Original Price
                    </Label>
                    <Input
                      id="price_before_discount"
                      name="price_before_discount"
                      type="number"
                      value={priceBeforeDiscount}
                      onChange={(e) =>
                        setPriceBeforeDiscount(Number(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Discounted Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="final_price">Discount Amount</Label>
                    <Input
                      id="final_price"
                      name="final_price"
                      type="number"
                      value={priceBeforeDiscount - price}
                      readOnly
                      className="w-full bg-muted/50"
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" className="w-full md:w-auto" size="lg">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Test Series
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default TSCreateForm;
