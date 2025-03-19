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
      className="flex flex-col md:flex-row gap-8"
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

        const { data, success } = await createTestSeries(payload);
        if (success) {
          router.push(`/teacher/test-series/${data?.data?.test_series_id}`);
        }
      }}
    >
      {/* Left Column */}
      <div className="flex-1">
        <div>
          <Label htmlFor="exam">Select an exam to proceed</Label>
          <Select
            name="exam"
            onValueChange={(value) => {
              const exam = data.find(
                (exam) => exam.exam_id.toString() === value
              );
              setSelectedExam(exam || null);
            }}
          >
            <SelectTrigger>
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
          <div>
            <h2>Subjects: </h2>
            <p>
              {selectedExam.default_pattern.subjects
                .map((subject) => subject.subject)
                .join(", ")}
            </p>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="flex-1">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" maxLength={100} />
          <p className="text-sm text-muted-foreground">
            Title must be 100 characters or less.
          </p>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select name="difficulty" required>
              <SelectTrigger>
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

          <div className="flex-1">
            <Label htmlFor="language">Language</Label>
            <Select name="language" required>
              <SelectTrigger>
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

        <div>
          <Label htmlFor="pricing">Pricing</Label>
          <RadioGroup
            name="pricing"
            onValueChange={(value) => setIsPaid(value === "paid")}
            required
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="pricing-free" value="free" />
              <Label htmlFor="pricing-free">Free</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="pricing-paid" value="paid" />
              <Label htmlFor="pricing-paid">Paid</Label>
            </div>
          </RadioGroup>
        </div>

        {isPaid && (
          <div className="flex gap-2 items-center justify-between">
            <div>
              <Label htmlFor="price_before_discount">
                Price Before Discount
              </Label>
              <Input
                id="price_before_discount"
                name="price_before_discount"
                type="number"
                value={priceBeforeDiscount}
                onChange={(e) => setPriceBeforeDiscount(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="final_price">Final Price</Label>
              <Input
                id="final_price"
                name="final_price"
                type="number"
                value={priceBeforeDiscount - price}
                readOnly
              />
            </div>
          </div>
        )}

        <div className="text-right">
          <Button type="submit" className="mt-4">
            Create Test Series
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TSCreateForm;
