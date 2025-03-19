"use client";

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

          const selectedSubjects = subjects.filter(
            (subject) => subject.inclued
          );

          if (selectedSubjects.length === 0) {
            alert("Please select at least one subject.");
            return;
          }

          const payload = {
            test_series_id: data.test_series_id ?? 0,
            exam_id: data.exam_id ?? 0,
            title: String(formData.get("title") || ""),
            duration: Number(formData.get("duration") || 0),
            academy_id: user?.user?.academy?.academy_id ?? 0,
            subjects: selectedSubjects,
          };

          await addTest(payload);
        }}
      >
        <Label htmlFor="title">Test Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter test title"
          required
        />

        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          name="duration"
          type="number"
          placeholder="Enter duration in minutes"
          defaultValue={data.exam.default_pattern.exam_duration}
          required
        />

        <h2>Select which subjects you wanted to be included in this test</h2>
        {data.exam.default_pattern.subjects.map((subject) => (
          <div
            key={subject.subject_id}
            className="flex justify-between items-center gap-2"
          >
            <div className="flex gap-3 items-center">
              <Checkbox
                id={`subject-${subject.subject_id}`}
                name={`subject-${subject.subject_id}`}
                defaultChecked={true}
              />
              <Label htmlFor={`subject-${subject.subject_id}`}>
                {subject.subject}
              </Label>
            </div>
            <Input
              id={`questions-${subject.subject_id}`}
              name={`questions-${subject.subject_id}`}
              type="number"
              defaultValue={subject.questions}
              placeholder="Enter number of questions"
              className="w-24"
            />
          </div>
        ))}

        <div className="text-right mt-4">
          <Button type="submit">Create Test</Button>
        </div>
      </form>
    </div>
  );
};

export default AddTestForm;
