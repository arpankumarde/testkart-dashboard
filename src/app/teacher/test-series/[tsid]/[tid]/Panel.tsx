"use client";

import dynamic from "next/dynamic";

const ReactQuillComponent = dynamic(
  () => import("@/components/blocks/ReactQuillComponent"),
  {
    ssr: false,

    loading: () => (
      <div className="h-32 border rounded-md flex items-center justify-center bg-muted/50">
        Loading editor...
      </div>
    ),
  }
);
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import getTokenClient from "@/lib/getTokenClient";
import { FaCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import AddQComp from "./_components/AddQComp";
import LoaderComponent from "@/components/blocks/LoaderComponent";

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
  optionId?: number;
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

export interface NewQuestionData {
  index: number;
  options: Option[];
  question: string;
  question_type: string;
  solution: string;
  subject_id: number;
  test_id: number;
}

const Panel = ({ test }: { test: Test }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const subjects = test.subjects.filter((s) => s.inclued);
  const [subject, setSubject] = useState<number>(subjects[0]?.subject_id);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [question, setQuestion] = useState<Question2 | null>(null);
  const [questionIndex, setQuestionIndex] = useState<number | null>(null);

  const newQuestionDataTemplate: NewQuestionData = {
    question: "",
    question_type: "MCQ-S",
    solution: "",
    subject_id: subject,
    test_id: test?.test_id,
    index: questionIndex || 0,
    options: [
      {
        optionId: 1,
        option: "",
        is_correct: false,
      },
      {
        optionId: 2,
        option: "",
        is_correct: false,
      },
      {
        optionId: 3,
        option: "",
        is_correct: false,
      },
      {
        optionId: 4,
        option: "",
        is_correct: false,
      },
    ],
  };

  const [newQuestion, setNewQuestion] = useState<NewQuestionData>(
    newQuestionDataTemplate
  );

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
    setLoading(true);
    const { data: singleQuestion }: { data: ApiResponse2 } = await api.get(
      `/api/v1/test-series/test/question/${index}`,
      {
        headers: {
          Authorization: `Bearer ${getTokenClient()}`,
        },
      }
    );

    setQuestion(singleQuestion?.data?.question);
    console.log("Single Question: ", singleQuestion);
    setLoading(false);
  };

  const updateQuestion = async (index: number) => {
    if (
      !question ||
      !question?.options ||
      question?.options.length !== 4 ||
      !question?.options.some((o) => o.is_correct)
    ) {
      alert(
        "Please ensure all fields are filled and one option is selected as correct."
      );
      return;
    }

    try {
      setLoading(true);

      const body = {
        index: question.index,
        options: question.options,
        question_type: question.question_type,
        question: question.question,
        solution: question.options.find((o) => o.is_correct)?.option || "",
        subject_id: question.subject_id,
        test_id: question.test_id,
      };

      const { data: singleQuestion }: { data: ApiResponse } = await api.put(
        `/api/v1/test-series/test/question/${index}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${getTokenClient()}`,
          },
        }
      );

      if (singleQuestion?.success) {
        setQuestions(singleQuestion?.data?.questions);
        setNewQuestion(newQuestionDataTemplate);
        alert("Question updated successfully!");
      } else {
        alert("Failed to update question. Please try again.");
      }
    } catch (error) {
      console.error("Error updating question:", error);
      alert("An error occurred while updating the question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async () => {
    if (
      !newQuestion ||
      !newQuestion.options ||
      newQuestion.options.length !== 4
    ) {
      alert("Please fill all the fields");
      return;
    }

    if (!newQuestion.options.some((o) => o.is_correct)) {
      alert("Please select one correct option");
      return;
    }

    try {
      setLoading(true);
      const newQuestionParsed = {
        ...newQuestion,
        subject_id: subject,
        index: questionIndex || 0,
        solution: newQuestion.solution || "",
      };

      const { data }: { data: ApiResponse } = await api.post(
        "/api/v1/test-series/test/question",
        newQuestionParsed,
        {
          headers: {
            Authorization: `Bearer ${getTokenClient()}`,
          },
        }
      );

      if (data?.success) {
        setQuestions(data?.data?.questions);
        // Reset the form after successful submission
        // setNewQuestion({
        //   ...newQuestionDataTemplate,
        //   index: questionIndex || 0,
        // });
        alert("Question added successfully!");
      } else {
        alert("Failed to add question. Please try again.");
      }

      console.log(data);
    } catch (error) {
      console.error("Error adding question:", error);
      alert("An error occurred while adding the question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  useEffect(() => {
    setLoading(true);
    console.log(subject);
    getQuestions();
    setLoading(false);
  }, [subject]);

  return (
    <div className="w-full flex flex-col">
      {/* Subjects row at the top */}
      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => (
            <Button
              key={s.subject_id}
              variant={s.subject_id === subject ? "default" : "outline"}
              onClick={() => setSubject(s.subject_id)}
              className="text-xs"
              size={"sm"}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Question buttons row */}
      <div className="p-4 bg-muted/10 overflow-x-auto">
        <div className="flex flex-wrap gap-2">
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
                className="w-12 h-12"
                onClick={() => {
                  setQuestionIndex(i);
                  const existingQuestion = questions.find((q) => q.index === i);
                  if (existingQuestion) {
                    console.log("Existing Question", existingQuestion);
                    getQuestion(existingQuestion?.question_id);
                  } else {
                    setQuestion(null);
                    // Reset the form with fresh template data when selecting a blank question
                    setNewQuestion({
                      ...newQuestionDataTemplate,
                      index: i,
                      subject_id: subject,
                      test_id: test?.test_id,
                    });
                  }
                }}
              >
                <div className="relative flex items-center justify-center">
                  {i + 1}
                  {questions.some((q) => q.index === i) && (
                    <FaCircle className="text-green-500 !w-2 !h-2 absolute top-0 right-0" />
                  )}
                </div>
              </Button>
            )
          )}
        </div>
      </div>

      {/* Main content area with editor and preview */}
      <div className="p-4">
        {questionIndex !== null && (
          <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-md flex-wrap md:flex-nowrap justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Type:</span>
              <Select name="question_type" defaultValue={"MCQ-S"} disabled>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"MCQ-S"}>MCQ-S</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {question && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">Correct:</span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-sm font-medium">
                    +{question.positive_marks || "NA"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">Incorrect:</span>
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded text-sm font-medium">
                    {question.negative_marks || "NA"}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <LoaderComponent />
          </div>
        ) : (
          <div>
            {questionIndex === null ? (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-muted-foreground text-center text-lg">
                  Select a question number to begin editing
                </p>
              </div>
            ) : questionIndex !== null && question ? (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left panel - Editor */}
                <div className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Question:</label>
                      <div className="border rounded-md">
                        <ReactQuillComponent
                          value={question?.question}
                          setValue={(val) =>
                            setQuestion({ ...question, question: val })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium">Options:</label>
                      <div className="grid gap-4">
                        {question?.options?.map((option, index) => (
                          <div
                            key={option?.optionId ?? index}
                            className="border rounded-md p-3 bg-background"
                          >
                            <div className="mb-2">
                              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-muted font-medium text-sm mb-1">
                                {String.fromCharCode(65 + index)}
                              </span>
                            </div>
                            <div className="border rounded-md">
                              <ReactQuillComponent
                                value={option?.option}
                                setValue={(val) =>
                                  setQuestion({
                                    ...question,
                                    options: question?.options.map((o, i) =>
                                      i === index ? { ...o, option: val } : o
                                    ),
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center gap-2 mt-2 p-2 bg-muted/30 rounded-md">
                              <Checkbox
                                id={`option-${index}`}
                                checked={option?.is_correct}
                                onCheckedChange={() => {
                                  const updatedOptions = question?.options.map(
                                    (o, i) => ({
                                      ...o,
                                      is_correct: i === index,
                                    })
                                  );
                                  setQuestion({
                                    ...question,
                                    options: updatedOptions,
                                  });
                                }}
                              />
                              <Label
                                htmlFor={`option-${index}`}
                                className="cursor-pointer"
                              >
                                This is the correct option
                              </Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Solution:</label>
                      <div className="border rounded-md">
                        <ReactQuillComponent
                          value={question?.solution}
                          setValue={(val) =>
                            setQuestion({ ...question, solution: val })
                          }
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        updateQuestion(question?.question_id);
                      }}
                      className="mt-4 w-full"
                    >
                      Save Question
                    </Button>
                  </div>
                </div>

                {/* Right panel - Preview */}
                <div className="bg-muted/20 p-4 rounded-lg space-y-4">
                  <h3 className="font-medium text-lg">Preview</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Question ID: {question?.question_id}
                      </div>
                      <div className="mt-2">
                        <div className="font-medium mb-1">Question:</div>
                        <div
                          className="p-3 bg-background rounded-md prose"
                          dangerouslySetInnerHTML={{
                            __html: question?.question,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium mb-2">Options:</div>
                      <div className="grid gap-2">
                        {question?.options?.map((option, index) => (
                          <div
                            key={`option-${option?.optionId ?? index}-${index}`}
                            className={`p-3 rounded-md flex items-start gap-2 ${
                              option?.is_correct
                                ? "bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700"
                                : "bg-background"
                            }`}
                          >
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-muted font-medium text-sm flex-shrink-0">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <div>
                              <div
                                className="prose"
                                dangerouslySetInnerHTML={{
                                  __html: option?.option,
                                }}
                              ></div>
                              {option?.is_correct && (
                                <span className="text-green-600 dark:text-green-400 text-sm font-medium mt-1 inline-block">
                                  Correct answer
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="font-medium mb-1">Solution:</div>
                      <div
                        className="p-3 bg-background rounded-md prose"
                        dangerouslySetInnerHTML={{
                          __html: question?.solution,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <AddQComp
                id={`${subject}-${questionIndex}`}
                key={`add-q-${subject}-${questionIndex}`}
                addQuestion={addQuestion}
                newQuestion={newQuestion}
                questionIndex={questionIndex}
                setNewQuestion={setNewQuestion}
                newQuestionDataTemplate={newQuestionDataTemplate}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Panel;
