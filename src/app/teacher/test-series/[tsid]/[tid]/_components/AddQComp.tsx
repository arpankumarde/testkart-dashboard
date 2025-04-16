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
    loading: () => <div>Loading editor...</div>,
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
    <div id={id}>
      <div>
        Question:
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
        Options:
        <div>
          {/* add 4 options spaces with recact quill and give checkboxed to sleect if thats's the correct option */}
          {newQuestion?.options?.map((option, index) => (
            <div key={option?.optionId ?? index}>
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
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={option?.is_correct}
                  onCheckedChange={() => {
                    const updatedOptions = newQuestion?.options.map((o, i) => ({
                      ...o,
                      is_correct: i === index,
                    }));
                    setNewQuestion({
                      ...newQuestion,
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
          value={newQuestion?.solution}
          setValue={(val) => setNewQuestion({ ...newQuestion, solution: val })}
        />
      </div>
      <div>
        <div>
          Question:
          <div
            dangerouslySetInnerHTML={{
              __html: newQuestion?.question,
            }}
          ></div>
        </div>
        <div>Options:</div>
        <div>
          {newQuestion?.options?.map((option) => (
            <Fragment key={option?.optionId}>
              <div dangerouslySetInnerHTML={{ __html: option?.option }}></div>
              <span> {option?.is_correct ? "Correct" : "Incorrect"}</span>
            </Fragment>
          ))}
        </div>

        <div>
          Solution:
          <div
            dangerouslySetInnerHTML={{
              __html: newQuestion?.solution,
            }}
          ></div>
        </div>
      </div>
      <Button onClick={addQuestion}>Save Question</Button>
    </div>
  );
};

export default AddQComp;
