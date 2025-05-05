"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import getTokenClient from "@/lib/getTokenClient";
import { getCookie } from "cookies-next/client";
import { AuthResponse } from "@/actions/auth";
import { useRouter } from "next/navigation";

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

interface AddTestFormProps {
  data: TestSeries;
}

interface Payload {
  test_series_id: number;
  exam_id: number;
  title: string;
  duration: number;
  academy_id: number;
  subjects: {
    label: string;
    subject_id: number;
    inclued: boolean;
    total_questions: number;
  }[];
}

const AddTestForm = ({ data }: AddTestFormProps) => {
  const userCookie = getCookie("tkuser");
  const user = userCookie
    ? (JSON.parse(userCookie as string) as AuthResponse["data"])
    : null;
  const router = useRouter();
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>(
    data.exam.default_pattern.subjects.map((subject) => subject.subject_id)
  );

  const addTest = async (payload: Payload) => {
    try {
      await api.post(`/api/v1/test-series/test`, payload, {
        headers: {
          Authorization: `Bearer ${getTokenClient()}`,
        },
      });

      router.push(`/teacher/test-series/${data.test_series_id}`);
    } catch (error) {
      console.error("Error creating test:", error);
    }
  };

  return (
    <div>
      <form
        className="space-y-6"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);

          const subjects = data.exam.default_pattern.subjects.map(
            (subject) => ({
              label: subject.subject,
              subject_id: subject.subject_id,
              inclued: formData.get(`subject-${subject.subject_id}`) === "on",
              total_questions: Number(
                formData.get(`questions-${subject.subject_id}`)
              ),
            })
          );

          if (selectedSubjects.length === 0) {
            alert("Please select at least one subject.");
            return;
          }

          const filteredSubjects = subjects.filter(
            (subject) => subject.inclued
          );

          const totalQuestions = filteredSubjects.reduce(
            (sum, subject) => sum + subject.total_questions,
            0
          );

          if (totalQuestions <= 0) {
            alert(
              "Total questions for included subjects must be greater than zero."
            );
            return;
          }

          const payload = {
            test_series_id: data.test_series_id ?? 0,
            exam_id: data.exam_id ?? 0,
            title: String(formData.get("title") || ""),
            duration: Number(formData.get("duration") || 0),
            academy_id: user?.user?.academy?.academy_id ?? 0,
            subjects: filteredSubjects,
          };

          await addTest(payload);
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">
                Test Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter test title"
                className="w-full"
                maxLength={60}
                required
              />
              <p className="text-xs text-muted-foreground">
                Give your test a descriptive title
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-base font-medium">
                Duration (minutes)
              </Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                placeholder="Enter duration in minutes"
                defaultValue={data.exam.default_pattern.exam_duration}
                className="w-full"
                required
              />
              <p className="text-xs text-muted-foreground">
                Time allowed for students to complete the test
              </p>
            </div>
          </div>

          {/* Test Information */}
          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <h3 className="font-medium">Test Series Information</h3>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Series:</span> {data.title}
              </p>
              <p>
                <span className="font-medium">Exam:</span> {data.exam.exam}
              </p>
              <p>
                <span className="font-medium">Default Duration:</span>{" "}
                {data.exam.default_pattern.exam_duration} minutes
              </p>
              <p>
                <span className="font-medium">Marking Scheme:</span> +
                {data.exam.default_pattern.positive_marks} / -
                {data.exam.default_pattern.negative_marks}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">Subject Selection</h2>
          <div className="bg-muted/20 md:p-4 rounded-lg">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between pb-2 mb-2 border-b">
                <div className="font-medium">Subject</div>
                <div className="font-medium">Questions</div>
              </div>

              {data.exam.default_pattern.subjects.map((subject) => (
                <div
                  key={subject.subject_id}
                  className="flex justify-between items-center gap-2 py-2 border-b border-muted-foreground/20"
                >
                  <div className="flex gap-3 items-center">
                    <Checkbox
                      id={`subject-${subject.subject_id}`}
                      name={`subject-${subject.subject_id}`}
                      defaultChecked={true}
                      className="h-5 w-5"
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSubjects((prev) => [
                            ...prev,
                            subject.subject_id,
                          ]);
                        } else {
                          setSelectedSubjects((prev) =>
                            prev.filter((id) => id !== subject.subject_id)
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`subject-${subject.subject_id}`}
                      className="text-base cursor-pointer"
                    >
                      {subject.subject}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`questions-${subject.subject_id}`}
                      name={`questions-${subject.subject_id}`}
                      type="number"
                      min={0}
                      defaultValue={subject.questions || 0}
                      placeholder="Questions"
                      className="w-24"
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Select the subjects to include in this test and specify the number
              of questions for each subject
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" className="px-8">
            Create Test
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTestForm;
