"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import getTokenClient from "@/lib/getTokenClient";
import { BadgeIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface Subject {
  label: string;
  subject_id: number;
  inclued: boolean;
  total_questions: number;
  question_count: number;
}

interface Exam {
  exam_id: number;
  exam: string;
  default_pattern: string;
}

interface TestSeries {
  title: string;
  exam: Exam;
}

interface Test {
  test_id: number;
  test_series_id: number;
  academy_id: number;
  title: string;
  duration: number;
  subjects: Subject[];
  status: number;
  is_deleted: number;
  scheduled_on: string;
  is_scheduled: number;
  is_paid: number;
  createdAt: string;
  updatedAt: string;
  test_sery: TestSeries;
}

interface Question {
  question_id: number;
  index: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    questions: Question[];
  };
}

const Panel = ({ test }: { test: Test }) => {
  const subjects = test.subjects.filter((s) => s.inclued);
  const [subject, setSubject] = useState<number>(subjects[0]?.subject_id);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);

  const getQuestions = async () => {
    const { data: questions }: { data: ApiResponse } = await api.get(
      `/api/v1/test-series/test/question?test_id=${test?.test_id}&subject_id=${subject}`,
      {
        headers: {
          Authorization: `Bearer ${getTokenClient()}`,
        },
      }
    );

    setQuestions(questions?.data?.questions);
  };

  useEffect(() => {
    getQuestions();
  }, [subject]);

  return (
    <div className="w-full flex bg-fuchsia-100">
      <div className="min-h-dvh w-[250px] bg-fuchsia-200 p-2 space-y-4">
        <Select
          defaultValue={subject?.toString()}
          onValueChange={(val) => setSubject(Number(val))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s.subject_id} value={s?.subject_id.toString()}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div>
          {/* show buttons of count = total number of questions in the selected subject with their index starting from 0*/}
          {Array.from(
            {
              length:
                subjects.find((s) => s.subject_id === subject)
                  ?.total_questions || 0,
            },
            (_, i) => (
              <Button
                key={i}
                variant={i === questionIndex ? "default" : "secondary"}
                type="button"
                className="w-full rounded-none"
                onClick={() => setQuestionIndex(i)}
                asChild
              >
                <div className="justify-between">
                  Question {i + 1}
                  {/* show badge if the question index is present in questions */}
                  {questions.some((q) => q.index === i) && (
                    <BadgeIcon size={24} fill="green" className="border-0" />
                  )}
                </div>
              </Button>
            )
          )}
        </div>
      </div>

      <div className="p-2">
        <div>Questions</div>
      </div>
    </div>
  );
};

export default Panel;
