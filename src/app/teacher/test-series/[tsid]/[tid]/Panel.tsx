"use client";

import ReactQuillComponent from "@/components/blocks/ReactQuillComponent";
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
import { Fragment, useEffect, useState } from "react";
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
  const [questionIndex, setQuestionIndex] = useState<number>(0);

  const newQuestionDataTemplate: NewQuestionData = {
    question: "",
    question_type: "MCQ-S",
    solution: "",
    subject_id: subject,
    test_id: test?.test_id,
    index: questionIndex,
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

    // copy the question to question state
    // let questiontemp = singleQuestion?.data?.question;

    setQuestion(singleQuestion?.data?.question);
    console.log("Single Question: ", singleQuestion);
    setLoading(false);
  };

  const updateQuestion = async (index: number) => {
    // check if the question is present and there are four options and one of the option is marked as correct
    if (
      !question ||
      !question?.options ||
      question?.options.length !== 4 ||
      !question?.options.some((o) => o.is_correct)
    ) {
      return;
    }

    setLoading(true);

    // abstract only the required fields from the question: index, options, question_type, solution, subject_id, test_id
    const body = {
      index: question.index,
      options: question.options,
      question_type: question.question_type,
      question: question.question,
      solution: question.solution,
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
    }
    setLoading(false);
  };

  const addQuestion = async () => {
    // check if all fields of new question are present
    if (
      !newQuestion ||
      !newQuestion.options ||
      newQuestion.options.length !== 4
    ) {
      alert("Please fill all the fields");
      return;
    }

    // check if one of the options is marked as correct
    if (!newQuestion.options.some((o) => o.is_correct)) {
      alert("Please select one correct option");
      return;
    }

    const newQuestionParsed = {
      ...newQuestion,
      subject_id: subject,
      index: questionIndex,
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
    }

    console.log(data);
  };

  useEffect(() => {
    setQuestionIndex(0);
    getQuestions();
  }, []);

  useEffect(() => {
    setLoading(true);
    console.log(subject);
    getQuestions();
    setLoading(false);
  }, [subject]);

  console.log("Qs", questions);
  console.log("Q", question);

  return (
    <div className="w-full flex flex-col md:flex-row">
      <div className="md:min-h-dvh md:w-[250px] space-y-4">
        <Select
          defaultValue={subject?.toString()}
          onValueChange={(val) => setSubject(Number(val))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s?.subject_id} value={s?.subject_id.toString()}>
                {s?.label}
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
                className="p-0 w-12 h-12 rounded-none"
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
                {questions.some((q) => q.index === i) ? (
                  <div className="flex justify-center">
                    {i + 1}
                    <FaCircle className="text-green-500 !w-2 !h-2 -m-1" />
                  </div>
                ) : (
                  <div className="justify-center">{i + 1}</div>
                )}
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

        {loading ? (
          <LoaderComponent />
        ) : (
          <div>
            {/* show question if the question index is present in questions */}
            {/* {questions
            .filter((q) => q.index === questionIndex)
            .map((q) => (
              <div key={q.question_id}>
                <div>Question: {q.index + 1}</div>
                <div>Question ID: {q.question_id}</div>
              </div>
            ))} */}

            {/* if question is null show question not found, else show the questions*/}
            {question ? (
              <div>
                <div>
                  Question:
                  <ReactQuillComponent
                    value={question?.question}
                    setValue={(val) =>
                      setQuestion({ ...question, question: val })
                    }
                  />
                  Options:
                  <div>
                    {/* add 4 options spaces with recact quill and give checkboxed to sleect if thats's the correct option
                     */}
                    {question?.options?.map((option, index) => (
                      <div key={option?.optionId ?? index}>
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
                        <div className="flex items-center gap-2">
                          <Checkbox
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
                          <Label>This is the correct option</Label>
                        </div>
                      </div>
                    ))}
                  </div>
                  Solution:
                  <ReactQuillComponent
                    value={question?.solution}
                    setValue={(val) =>
                      setQuestion({ ...question, solution: val })
                    }
                  />
                </div>
                <div>
                  <div>Question ID: {question?.question_id}</div>
                  <div>
                    Question:
                    <div
                      dangerouslySetInnerHTML={{ __html: question?.question }}
                    ></div>
                  </div>
                  <div>Options:</div>
                  <div>
                    {question?.options?.map((option) => (
                      <Fragment key={option?.optionId}>
                        <div
                          dangerouslySetInnerHTML={{ __html: option?.option }}
                        ></div>
                        <span>
                          {" "}
                          {option?.is_correct ? "Correct" : "Incorrect"}
                        </span>
                      </Fragment>
                    ))}
                  </div>

                  <div>
                    Solution:
                    <div
                      dangerouslySetInnerHTML={{ __html: question?.solution }}
                    ></div>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    updateQuestion(question?.question_id);
                  }}
                >
                  Submit
                </Button>
              </div>
            ) : (
              <AddQComp
                id={`${subject}-${questionIndex}`}
                key={`${subject}-${questionIndex}`}
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
