"use client";

import React, { Suspense, useCallback, useId } from "react";
import ReactQuill from "react-quill-new";

interface ReactQuillComponentProps {
  value: string;
  setValue: (value: string) => void;
}

const QUILL_MODULES = {
  toolbar: {
    container: [
      [{ header: [2, 3, 4, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["image"],
      ["clean"],
    ],
  },
};

const ReactQuillComponent = React.memo(
  ({ value, setValue }: ReactQuillComponentProps) => {
    const id = useId();

    // Use a stable callback for onChange to prevent unnecessary re-renders
    const handleChange = useCallback(
      (newValue: string) => {
        setValue(newValue);
      },
      [setValue]
    );

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ReactQuill
          theme="snow"
          value={value || ""}
          onChange={handleChange}
          modules={QUILL_MODULES}
          className="prose"
          key={id}
        />
      </Suspense>
    );
  }
);

export default ReactQuillComponent;
