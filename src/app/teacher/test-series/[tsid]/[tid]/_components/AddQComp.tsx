"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dispatch, Fragment, useEffect } from "react";
import { NewQuestionData } from "../Panel";
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

const AddQComp = ({
  id,
  newQuestion,
  setNewQuestion,
  questionIndex,
  addQuestion,
  newQuestionDataTemplate,
}: {
  id: string;
  newQuestion: NewQuestionData;
  setNewQuestion: Dispatch<React.SetStateAction<NewQuestionData>>;
  questionIndex: number;
  addQuestion: () => Promise<void>;
  newQuestionDataTemplate: NewQuestionData;
}) => {
  useEffect(() => {
    setNewQuestion(newQuestionDataTemplate);
    console.log("Blank", id);
  }, [id]);

  return (
    <div className="grid md:grid-cols-2 gap-6" id={id}>
      {/* Left panel - Editor */}
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Question:</label>
          <div className="border rounded-md">
            <ReactQuillComponent
              key={id}
              value={newQuestion?.question ?? ""}
              setValue={(val) =>
                setNewQuestion({
                  ...newQuestion,
                  question: val,
                  index: questionIndex ?? 0,
                })
              }
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Options:</label>
          <div className="grid gap-4">
            {newQuestion?.options?.map((option, index) => (
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
                      setNewQuestion({
                        ...newQuestion,
                        options: newQuestion?.options.map((o, i) =>
                          i === index ? { ...o, option: val } : o
                        ),
                      })
                    }
                  />
                </div>
                <div className="flex items-center gap-2 mt-2 p-2 bg-muted/30 rounded-md">
                  <Checkbox
                    id={`new-option-${index}`}
                    checked={option?.is_correct}
                    onCheckedChange={() => {
                      const updatedOptions = newQuestion?.options.map(
                        (o, i) => ({
                          ...o,
                          is_correct: i === index,
                        })
                      );
                      setNewQuestion({
                        ...newQuestion,
                        options: updatedOptions,
                      });
                    }}
                  />
                  <Label
                    htmlFor={`new-option-${index}`}
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
              value={newQuestion?.solution}
              setValue={(val) =>
                setNewQuestion({ ...newQuestion, solution: val })
              }
            />
          </div>
        </div>

        <Button onClick={addQuestion} className="mt-4 w-full">
          Add Question
        </Button>
      </div>

      {/* Right panel - Preview */}
      <div className="bg-muted/20 p-4 rounded-lg space-y-4">
        <h3 className="font-medium text-lg">Preview</h3>
        <div className="space-y-4">
          <div>
            <div className="mt-2">
              <div className="font-medium mb-1">Question:</div>
              <div
                className="p-3 bg-background rounded-md prose"
                dangerouslySetInnerHTML={{
                  __html: newQuestion?.question,
                }}
              ></div>
            </div>
          </div>
          <div>
            <div className="font-medium mb-2">Options:</div>
            <div className="grid gap-2">
              {newQuestion?.options?.map((option, index) => (
                <div
                  key={option?.optionId}
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
                __html: newQuestion?.solution,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQComp;
