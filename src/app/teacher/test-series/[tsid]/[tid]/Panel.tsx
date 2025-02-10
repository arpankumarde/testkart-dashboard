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

// res 2
interface Option {
  option: string;
  is_correct: boolean;
  optionId: number;
}

interface Question2 {
  question_id: number;
  test_id: number;
  subject_id: number;
  question_type: string;
  question: string;
  options: Option[];
  solution: string;
  difficulty_level: number;
  topic: number;
  sub_topic: number;
  status: number;
  index: number;
  positive_marks: string;
  negative_marks: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse2 {
  success: boolean;
  message: string;
  data: {
    question: Question2;
  };
}

const Panel = ({ test }: { test: Test }) => {
  const subjects = test.subjects.filter((s) => s.inclued);
  const [subject, setSubject] = useState<number>(subjects[0]?.subject_id);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [question, setQuestion] = useState<Question2 | null>(null);
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

  const getQuestion = async (index: number) => {
    const { data: singleQuestion }: { data: ApiResponse2 } = await api.get(
      `/api/v1/test-series/test/question/${index}`,
      {
        headers: {
          Authorization: `Bearer ${getTokenClient()}`,
        },
      }
    );

    // copy the question to question state
    let questiontemp = singleQuestion?.data?.question;

    setQuestion(singleQuestion?.data?.question);
    console.log("QP", singleQuestion);
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
                onClick={() => {
                  setQuestionIndex(i);
                  // check if the question index is present in questions
                  const existingQuestion = questions.find((q) => q.index === i);
                  if (existingQuestion) {
                    console.log("Existing Question", existingQuestion);
                    getQuestion(existingQuestion?.question_id);
                  } else {
                    setQuestion(null);
                  }
                }}
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

      <div className="p-2 space-y-2 w-full">
        <div className="flex items-center gap-2">
          Type:{" "}
          <Select name="question_type" defaultValue={"MCQ-S"} disabled>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"MCQ-S"}>MCQ-S</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <hr />

        <div>
          {/* show question if the question index is present in questions */}
          {questions
            .filter((q) => q.index === questionIndex)
            .map((q) => (
              <div key={q.question_id}>
                <div>Question: {q.index + 1}</div>
                <div>Question ID: {q.question_id}</div>
              </div>
            ))}

          {/* if question is null show question not found, else show the questions*/}
          {question ? (
            <>
              <div>Question: {question?.question}</div>
              <div>Question ID: {question?.question_id}</div>
              <div>Question Type: {question?.question_type}</div>
              <div>Difficulty Level: {question?.difficulty_level}</div>
              <div>Positive Marks: {question?.positive_marks}</div>
              <div>Negative Marks: {question?.negative_marks}</div>
              <div>Options:</div>
              <div>
                {/* {question?.options?.map((option) => (
                  <div key={option?.optionId}>
                    {option?.option} -{" "}
                    {option?.is_correct ? "Correct" : "Wrong"}
                  </div>
                ))} */}
              </div>
              <div>Solution: {question?.solution}</div>
            </>
          ) : (
            <div>Question not found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Panel;
